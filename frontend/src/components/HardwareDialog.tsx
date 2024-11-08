import { useState, useRef} from "react";
import useAuth from "../hooks/Auth.tsx";

// Component for checking out hardware
function CheckOutHardware() {
    const [hardwareId, setHardwareId] = useState(""); // State for hardware ID
    const [quantity, setQuantity] = useState(1); // State for quantity
    const [projectId, setProjectId] = useState(""); // State for project ID
    const { token } = useAuth();
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Handling form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        // URL encode the projectId and hardwareId to avoid issues with special characters
        const encodedProjectId = encodeURIComponent(projectId);
        const encodedHardwareId = encodeURIComponent(hardwareId);

        //set url for CheckOutHardware
        const url = `/api/v1/projects/${encodedProjectId}/${encodedHardwareId}/check-out?amount=${quantity}`;
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: token?.data
                        ? `Bearer ${token.data}`
                        : "",
                },
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
    };

    return (
        <dialog ref={dialogRef}>
            <h2>Check Out Hardware</h2>
            <form onSubmit={(e) => { handleSubmit(e).catch((error) => console.error(error)); }}>
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
                            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        min="1"
                        required
                    />
                </label>
                <button type="submit">Check Out</button>
            </form>
            <button onClick={() => dialogRef.current?.close()}>Close</button>
        </dialog>
    );
}

// Component for checking in hardware
function CheckInHardware() {
    const [hardwareId, setHardwareId] = useState(""); // State for hardware ID
    const [quantity, setQuantity] = useState(1); // State for quantity
    const [projectId, setProjectId] = useState(""); // State for project ID
    const { token } = useAuth();
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        // URL encode the projectId and hardwareId to avoid issues with special characters
        const encodedProjectId = encodeURIComponent(projectId);
        const encodedHardwareId = encodeURIComponent(hardwareId);
        
        //set url for CheckInHardware
        const url = `/api/v1/projects/${encodedProjectId}/${encodedHardwareId}/check-in?amount=${quantity}`;
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: token?.data ? `Bearer ${token.data}` : "",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to update hardware");
            }
            console.log("Hardware checked in successfully");
        } catch (error) {
            console.error("Error:", error);
        }

        // Reset form fields after submission
        setQuantity(1);
        setHardwareId("");
        setProjectId("");
    };

    return (
        <dialog ref={dialogRef}>
            <h2>Check In Hardware</h2>
            <form onSubmit={(e) => { handleSubmit(e).catch((error) => console.error(error)); }}>
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
                            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        min="1"
                        required
                    />
                </label>
                <button type="submit">Check In</button>
            </form>
            <button onClick={() => dialogRef.current?.close()}>Close</button>
        </dialog>
    );
}

// Main component for controlling the dialog and actions
export default function HardwareDialog() {
    const [isCheckOutOpen, setIsCheckOutOpen] = useState(false); // State for CheckOut dialog open/close
    const [isCheckInOpen, setIsCheckInOpen] = useState(false); // State for CheckIn dialog open/close

    return (
        <>
            <button onClick={() => setIsCheckOutOpen(true)}>Check Out Hardware</button>
            <button onClick={() => setIsCheckInOpen(true)}>Check In Hardware</button>

            {isCheckOutOpen && <CheckOutHardware />}
            {isCheckInOpen && <CheckInHardware />}
        </>
    );
}