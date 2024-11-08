import { useState, useRef, useEffect } from "react";

// Define an enum for action types
enum ActionType {
    CheckOut = "checkOut",
    CheckIn = "checkIn",
}

//Component Setup and State Inits
export default function HardwareDialog() {
    const [isOpen, setIsOpen] = useState(false); // State for managing dialog open/close
    const [hardwareId, setHardwareId] = useState(""); // State for hardware ID, or should this projectID (same thing i guess)
    const [quantity, setQuantity] = useState(1); // State for quantity, init to 1
    const [action, setAction] = useState<ActionType>(ActionType.CheckOut); // Action state
    const [projectId, setProjectId] = useState(""); // State for project ID
    //const [authToken, setAuthToken] = useState<string>(""); // State for auth token
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Effect to open the dialog when isOpen changes to true
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            dialogRef.current.showModal();
        } else if (!isOpen && dialogRef.current) {
            dialogRef.current.close();
        }
    }, [isOpen]);

    // Handling form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!action) return; // Ensure there is an action set

        //set url depending on check-in or check-out is being called
        const url = `/api/v1/projects/${projectId}/${hardwareId}/${action === ActionType.CheckOut ? "check-out" : "check-in"}?amount=${quantity}`;
        try {
            const response = await fetch(url, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to update hardware");
            }
            console.log("Hardware updated successfully");
        } catch (error) {
            console.error("Error:", error);
        }

        setQuantity(1); // Reset quantity to default after submission
        setHardwareId(""); // Clear the input field
        setProjectId(""); // Clear the projectId field
        setIsOpen(false); // Close the dialog
    };

    return (
        <>
            <button
                onClick={() => {
                    setAction(ActionType.CheckOut);
                    setIsOpen(true);
                }}
                disabled={action === ActionType.CheckOut} //Disable CheckOut button if already in CheckOut mode
            >
                Check Out Hardware
            </button>
            <button
                onClick={() => {
                    setAction(ActionType.CheckIn);
                    setIsOpen(true);
                }}
                disabled={action === ActionType.CheckIn} //Disable CheckIn button if already in CheckIn mode
            >
                Check In Hardware
            </button>

            <dialog ref={dialogRef}>
                <h2>
                    {action === ActionType.CheckOut
                        ? "Check Out Hardware"
                        : "Check In Hardware"}
                </h2>
                <form
                    onSubmit={(e) => {
                        handleSubmit(e).catch((error) => console.error(error));
                    }}
                >
                    <label>
                        Project ID:
                        <input
                            type="text"
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Hardware ID:
                        <input
                            type="text"
                            value={hardwareId}
                            onChange={(e) => setHardwareId(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    Math.max(1, parseInt(e.target.value) || 1),
                                )
                            }
                            min="1"
                            required
                        />
                    </label>
                    <button type="submit">
                        {action === ActionType.CheckOut
                            ? "Check Out"
                            : "Check In"}
                    </button>
                </form>
                <button onClick={() => setIsOpen(false)}>Close</button>
            </dialog>
        </>
    );
}
