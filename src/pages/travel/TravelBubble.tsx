import styles from "./travel.module.css";

function TravelBubble({ desc }) {
    return (
        <div className={`bg-secondary ${styles.bubble}`}>{desc.substring(0, 2)}</div >
    )
}

export default TravelBubble