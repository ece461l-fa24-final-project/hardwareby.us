import { Token } from "../contexts/Auth.tsx";
import { useEffect, useState } from "react";
import call, { Method } from "../utils/api.ts";
import "../styles/HardwareSet.css";

enum ErrorType {
    None = "",
    InvalidOperation = "The quantity you attempted to check in/out is invalid. Please try again.",
    ItExploded = "It Exploded",
}

interface HardwareSetProps {
    token: Token;
    id: number;
}

export interface Hardware {
    id: number;
    projectid: string;
    name: string;
    capacity: number;
    available: number;
}

export default function HardwareSet({ token, id }: Readonly<HardwareSetProps>) {
    const [quantity, setQuantity] = useState(1);
    const [hardware, setHardware] = useState<Hardware>({
        id: id,
        projectid: "",
        name: "",
        capacity: 100,
        available: 100,
    });
    const availablePercent = (hardware.available / hardware.capacity) * 100;

    useEffect(() => {
        call(`hardware/${encodeURIComponent(id)}`, Method.Get, token)
            .then((response) => {
                if (!response.ok) {
                    alert(ErrorType.ItExploded);
                    throw new Error(ErrorType.ItExploded);
                }
                return response.json();
            })
            .then((data: Hardware) => {
                setHardware(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    const handleCheckOut = () => {
        call(
            `hardware/checkout/${encodeURIComponent(hardware.id)}?count=${encodeURIComponent(quantity)}`,
            Method.Put,
            token,
        )
            .then((response) => {
                if (!response.ok) {
                    alert(ErrorType.InvalidOperation);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setQuantity(1);
                window.location.reload();
            });
    };

    const handleCheckIn = () => {
        call(
            `hardware/checkin/${encodeURIComponent(hardware.id)}?count=${encodeURIComponent(quantity)}`,
            Method.Put,
            token,
        )
            .then((response) => {
                if (!response.ok) {
                    alert(ErrorType.InvalidOperation);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setQuantity(1);
                window.location.reload();
            });
    };

    return (
        <div className="hardwareset-container">
            <div className="capacity-bar-container">
                <div className="hardwareset-title">{hardware.name}</div>
                <div className="capacity-bar">
                    <div
                        className="capacity-bar-fill"
                        style={{ width: `${availablePercent}%` }}
                    />
                </div>
                <div className="availability-label">
                    Availability: {hardware.available.toString()}/
                    {hardware.capacity.toString()}
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
    );
}
