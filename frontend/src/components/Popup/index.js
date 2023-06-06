import "./Popup.css"

export default function Popup({ textTitle, textBody }) {
    return (
        <>
            <div className="popup">
                <h3>{textTitle}</h3>
                <p>{textBody}</p>
            </div>
        </>
    );
};
