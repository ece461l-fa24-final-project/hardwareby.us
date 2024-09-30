function UserView({loggedIn, setLoggedIn}) {
    return  (
        <>
            <h1>User Management</h1>
            <div>{loggedIn}</div>
            <button>log in</button>
            <button>sign up</button>
        </>
    )
}
export default UserView