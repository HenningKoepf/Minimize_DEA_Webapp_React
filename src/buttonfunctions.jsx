import React from 'react';
// In buttonFunctions.js

const NewNodeButton = () => {
    return (
    <>
    <button onClick={newNodeButtonClickHandler}>
        I'm a button for future use!
    </button>
    <button onRightClick ={contextNodeButtonClickHandler}>

    </button>
    </>


);
};
// MyButton.js



export default NewNodeButton;



export const newNodeButtonClickHandler = () => {
 //   alert("Das wird ein gutes Produkt!");

    const aNumber = Number(window.prompt("Userinput einer Zahl:", "0"));
    if (aNumber != 0){
        alert("Du hast " + aNumber + " als deine Zahl gewählt!");
        console.log("No error occurred while loading the ButtonclickHandlerinput, it was: " + aNumber);
    }else{
        alert("Du hast keine Zahl gewählt!");
    }
};

export const contextNodeButtonClickHandler = () => {
    console.log ("Es wurde rightclicked")
}
