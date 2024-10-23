#!/usr/bin/env escript
%%! +sbtu +A1
%%%-------------------------------------------------------------------
%%% @author Isaac Nudelman
%%% @doc Escript to automate running backend and frontend servers
%%%
%%% @end
%%% Created : 23. Oct 2024 3:40PM
%%%-------------------------------------------------------------------
-author("Isaac Nudelman").

-mode(compile).

main(_Args) ->
    io:format("Starting development environment...~n"),
    process_flag(trap_exit, true),

    Config = #{
        backend_path => "./backend",
        frontend_path => "./frontend",
        backend_cmd => "gleam",
        backend_args => ["run"],
        frontend_cmd => "bun",
        frontend_args => ["run", "dev"]
    },

    io:format("Checking that gleam is installed...~n"),
    % TODO
    

    % Start both servers
    BackendPid = start_backend(Config),
    FrontendPid = start_frontend(Config),

    % Set up file watchers
    BackendWatcher = spawn_link(fun() ->
        watch_directory(Config#{
            path => maps:get(backend_path, Config),
            pid => BackendPid,
            name => "backend",
            restart_fn => fun() -> start_backend(Config) end
        })
                                end),

    FrontendWatcher = spawn_link(fun() ->
        watch_directory(Config#{
            path => maps:get(frontend_path, Config),
            pid => FrontendPid,
            name => "frontend",
            restart_fn => fun() -> start_frontend(Config) end
        })
                                 end),

    % Wait for signals or crashes
    wait_for_changes(#{
        backend_pid => BackendPid,
        frontend_pid => FrontendPid,
        backend_watcher => BackendWatcher,
        frontend_watcher => FrontendWatcher
    }).

start_backend(Config) ->
    Cmd = maps:get(backend_cmd, Config),
    Args = maps:get(backend_args, Config),
    Path = maps:get(backend_path, Config),
    io:format("Starting Gleam backend server...~n"),
    spawn_link(fun() ->
        process_flag(trap_exit, true),
        Port = open_port({spawn_executable, os:find_executable(Cmd)},
            [{cd, Path}, {args, Args}, {line, 1024}, stream, use_stdio, stderr_to_stdout]),
        port_loop(Port, "backend")
               end).

start_frontend(Config) ->
    Cmd = maps:get(frontend_cmd, Config),
    Args = maps:get(frontend_args, Config),
    Path = maps:get(frontend_path, Config),
    io:format("Starting Vite frontend server...~n"),
    spawn_link(fun() ->
        process_flag(trap_exit, true),
        Port = open_port({spawn_executable, os:find_executable(Cmd)},
            [{cd, Path}, {args, Args}, {line, 1024}, stream, use_stdio, stderr_to_stdout]),
        port_loop(Port, "frontend")
               end).

port_loop(Port, Name) ->
    receive
        {Port, {data, {_, Line}}} ->
            io:format("[~s] ~s~n", [Name, Line]),
            port_loop(Port, Name);
        {'EXIT', Port, Reason} ->
            io:format("~s process exited: ~p~n", [Name, Reason]);
        stop ->
            Port ! {self(), close},
            receive
                {Port, closed} ->
                    exit(normal)
            end;
        {'EXIT', _, _} ->
            Port ! {self(), close},
            exit(normal)
    end.

watch_directory(Config) ->
    Path = maps:get(path, Config),
    Pid = maps:get(pid, Config),
    Name = maps:get(name, Config),
    RestartFn = maps:get(restart_fn, Config),

    % Set up file system monitor
    {ok, Ref} = file:list_dir_all(Path),
    watch_loop(#{
        ref => Ref,
        path => Path,
        pid => Pid,
        name => Name,
        restart_fn => RestartFn,
        last_change => os:timestamp()
    }).

watch_loop(State) ->
    Ref = maps:get(ref, State),
    Path = maps:get(path, State),
    LastChange = maps:get(last_change, State),

    receive
        {Ref, file_modified} ->
            CurrentTime = os:timestamp(),
            case timer:now_diff(CurrentTime, LastChange) > 1000000 of % 1 second debounce
                true ->
                    Name = maps:get(name, State),
                    io:format("~s changes detected, restarting...~n", [Name]),
                    Pid = maps:get(pid, State),
                    RestartFn = maps:get(restart_fn, State),
                    exit(Pid, kill),
                    NewPid = RestartFn(),
                    watch_loop(State#{
                        pid => NewPid,
                        last_change => CurrentTime
                    });
                false ->
                    watch_loop(State#{last_change => CurrentTime})
            end;
        {'EXIT', _, _} ->
            ok
    end.

wait_for_changes(State) ->
    receive
        {'EXIT', Pid, Reason} ->
            case Reason of
                normal -> ok;
                killed -> ok;
                _ ->
                    io:format("Process ~p exited with reason: ~p~n", [Pid, Reason]),
                    % If it's one of our processes, restart it
                    NewState = handle_crash(Pid, State),
                    wait_for_changes(NewState)
            end;
        shutdown ->
            cleanup(State);
        _ ->
            wait_for_changes(State)
    end.

handle_crash(Pid, State = #{backend_pid := Pid}) ->
    io:format("Backend crashed, restarting...~n"),
    NewPid = start_backend(#{
        backend_path => "./backend",
        backend_cmd => "gleam",
        backend_args => ["run"]
    }),
    State#{backend_pid => NewPid};

handle_crash(Pid, State = #{frontend_pid := Pid}) ->
    io:format("Frontend crashed, restarting...~n"),
    NewPid = start_frontend(#{
        frontend_path => "./frontend",
        frontend_cmd => "bun",
        frontend_args => ["run", "dev"]
    }),
    State#{frontend_pid => NewPid};

handle_crash(_, State) ->
    State.

cleanup(State) ->
    maps:foreach(fun
                     (_, Pid) when is_pid(Pid) ->
                         exit(Pid, kill);
                     (_, _) ->
                         ok
                 end, State),
    ok.
