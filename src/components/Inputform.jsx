import React, { useState } from "react";

function InputForm({ onSubmit }) {
    const [inputValue, setInputValue] = useState(""); // Zustand, um den eingegebenen Text zu speichern

    const handleInputChange = (e) => {
        // Diese Funktion wird aufgerufen, wenn der Benutzer den Text im Eingabefeld ändert
        setInputValue(e.target.value); // Aktualisieren Sie den Zustand mit dem neuen Wert
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Verhindern Sie das Standardverhalten des Formulars
        // Rufen Sie die übergebene onSubmit-Funktion auf und übergeben Sie den inputValue
        onSubmit(inputValue);
    };

    return (
        <div>
            <h2>Input Form</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Eingabefeld:
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Absenden</button>
            </form>
        </div>
    );
}

export default InputForm;
