// In buttonFunctions.js

// MyButton.js
import React from 'react';


const MyButton = () => {
    return (
        <button onClick={myButtonClickHandler}>
            I'm a button for future use!
        </button>
    );
};

export default MyButton;



export const myButtonClickHandler = () => {
 //   alert("Das wird ein gutes Produkt!");
    const aNumber = Number(window.prompt("Userinput einer Zahl:", " "));
    alert("Du hast " + aNumber + " als deine Zahl gewählt!");
    console.log("No error occurred while loading the ButtonclickHandlerinput, it was: " + aNumber);
};
