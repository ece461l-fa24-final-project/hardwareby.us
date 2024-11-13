import { Token } from "../contexts/Auth.tsx";
import { HardwareSet } from "../utils/types.ts"
import { useState } from "react";
import "../styles/HardwareSetComponent.css"

interface HardwareSetComponentProps {
    token: Token;
    hardwareSet: HardwareSet;
}

export default function HardwareSetComponent({
    token,
    hardwareSet
}: Readonly<HardwareSetComponentProps>) {
    const [quantity, setQuantity] = useState(1);
    const availablePercent = (hardwareSet.available / hardwareSet.capacity) * 100;

    return (
        <>
            <div className="hardwareset-container">
                <div className="capacity-bar-container">
                    <div className="hardwareset-title">{hardwareSet.name}</div>
                    <div className="capacity-bar">
                        <div className="capacity-bar-fill" style={{width: `${availablePercent}%`}}/>
                    </div>
                    <div className="availability-label">Availability: {hardwareSet.available.toString()}/{hardwareSet.capacity.toString()}</div>
                </div>
                <div className="controls-container">
                    <label style={{display: "flex", flexDirection: "column", marginRight: "10px"}}>
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
                    <div style={{flexDirection: "column"}}>
                        <button>Check Out</button>
                        <button>Check In</button>
                    </div>
                </div>
            </div>
        </>
    )
}