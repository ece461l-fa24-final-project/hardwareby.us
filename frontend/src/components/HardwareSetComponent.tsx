import { Token } from "../contexts/Auth.tsx";
import { HardwareSet } from "../utils/types.ts";
import { useState } from "react";
import call, { Method } from "../utils/api.ts";
import "../styles/HardwareSetComponent.css";

enum ErrorType {
    None = "",
    InvalidOperation = "The quantity you attempted to check in/out is invalid. Please try again.",
}

interface HardwareSetComponentProps {
    token: Token;
    hardwareSet: HardwareSet;
}

export default function HardwareSetComponent({
    token,
    hardwareSet,
}: Readonly<HardwareSetComponentProps>) {
    const [quantity, setQuantity] = useState(1);
    const availablePercent =
        (hardwareSet.available / hardwareSet.capacity) * 100;

    const handleCheckOut = () => {
        call(
            `hardware/checkout/${encodeURIComponent(hardwareSet.id)}?count=${encodeURIComponent(quantity)}`,
            Method.Put,
            token,
        )
            .then((response) => {
                if (!response.ok) {
                    console.error(ErrorType.InvalidOperation);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setQuantity(1);
            });
    };

    const handleCheckIn = () => {
        call(
            `hardware/checkin/${encodeURIComponent(hardwareSet.id)}?count=${encodeURIComponent(quantity)}`,
            Method.Put,
            token,
        )
            .then((response) => {
                if (!response.ok) {
                    console.error(ErrorType.InvalidOperation);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setQuantity(1);
            });
    };

    return (
        <>
            <div className="hardwareset-container">
                <div className="capacity-bar-container">
                    <div className="hardwareset-title">{hardwareSet.name}</div>
                    <div className="capacity-bar">
                        <div
                            className="capacity-bar-fill"
                            style={{ width: `${availablePercent}%` }}
                        />
                    </div>
                    <div className="availability-label">
                        Availability: {hardwareSet.available.toString()}/
                        {hardwareSet.capacity.toString()}
                    </div>
                </div>
                <div className="controls-container">
                    <label
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: "10px",
                        }}
                    >
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
                    <div style={{ flexDirection: "column" }}>
                        <button onClick={handleCheckOut}>Check Out</button>
                        <button onClick={handleCheckIn}>Check In</button>
                    </div>
                </div>
            </div>
        </>
    );
}
