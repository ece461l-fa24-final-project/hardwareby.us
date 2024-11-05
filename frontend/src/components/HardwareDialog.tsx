import { useState, useRef, useEffect } from "react";

interface HardwareDialogProps {
    isOpen: boolean; // Determines if the dialog is open
    onClose: () => void; // Function to close the dialog
    onSubmit: (action: "checkOut" | "checkIn", hardwareId: string, quantity: number) => void; // Function to handle submit
}

//Component Setup and State Inits
const HardwareDialog = ({ isOpen, onClose, onSubmit }: HardwareDialogProps) => {
    const [hardwareId, setHardwareId] = useState(""); // State for hardware ID, or should this projectID (same thing i guess)
    const [quantity, setQuantity] = useState(1); // State for quantity, init to 1
    const [action, setAction] = useState<"checkOut" | "checkIn">("checkOut"); // Action state

    const dialogRef = useRef<HTMLDialogElement>(null);

    // Effect to open or close the dialog based on the isOpen prop
    useEffect(() => {
        if (isOpen) {
            //if isOpen is true, than showModal methods opens the dialog
            dialogRef.current?.showModal();
        } else {
            //if isOpen is false, than we close the dialog
            dialogRef.current?.close();
        }
    }, [isOpen]); //useEffect triggered whenever isOpen changes

    //Handling form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hardwareId && quantity > 0) {
            onSubmit(action, hardwareId, quantity); // Call onSubmit with action, hardwareId, and quantity
            setHardwareId(""); // Clear input after submission
            setQuantity(1); // Reset quantity to default after submission
            onClose(); // Close dialog after submission
        }
    };

    const toggleAction = () => {
        setAction((prev) => (prev === "checkOut" ? "checkIn" : "checkOut")); //Allow for the action to switch back and forth between checkOut or checkIn
    };

    return (
        <dialog ref={dialogRef} className="dialog">
            <div className="dialog-content">
                <h2>{action === "checkOut" ? "Check Out Hardware" : "Check In Hardware"}</h2>
                <form onSubmit={handleSubmit}>
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
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            required
                        />
                    </label>
                    <button type="submit">{action === "checkOut" ? "Check Out" : "Check In"}</button>
                    <button type="button" onClick={toggleAction}>
                        Switch to {action === "checkOut" ? "Check In" : "Check Out"}
                    </button>
                </form>
                <button onClick={() => { setHardwareId(""); onClose(); }}>Close</button>
            </div>
        </dialog>
    );
};

export default HardwareDialog;
