export default function DateTimeDisplay({ value, type }) {
    return (
        <div className="counter-section">
            <p>{value}</p>
            <span>{type}</span>
        </div>
    )
}
