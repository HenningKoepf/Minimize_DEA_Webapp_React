import React, { useState, useEffect } from "react";
import { ContextMenu } from "../styles/styles";
import Menu from "./Menu";
const MenuContext = ({ data }) => {
    const [clicked, setClicked] = useState(false);
    const [points, setPoints] = useState({
        x: 0,
        y: 0,
    });
    useEffect(() => {
        const handleClick = () => setClicked(false);
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("click", handleClick);
        };
    }, []);
    return (
        <div>
            {data.map((item) => (
                <div
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setClicked(true);
                        setPoints({
                            x: e.pageX,
                            y: e.pageY,
                        });
                        console.log("Right Click", e.pageX, e.pageY);
                    }}
                >
                    <Menu id={item.id} title={item.title} />
                </div>
            ))}
            {clicked && (
                <ContextMenu top={points.y} left={points.x}>
                    <ul>
                        <li>Edit</li>
                        <li>Copy</li>
                        <li>Delete</li>
                    </ul>
                </ContextMenu>
            )}
        </div>
    );
};
export default MenuContext;