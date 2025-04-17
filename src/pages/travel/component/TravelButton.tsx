function TravelButton({ className = "", onClick = () => { }, children }) {
    return (
        <button type="button" className={`btn btn-outline-success d-flex align-items-center ${className}`} onClick={onClick}>
            {children}
        </button >
    )
}

export default TravelButton