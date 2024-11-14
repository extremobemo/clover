
import styles from "../../styles/GalleryDescription.module.css"

interface GalleryDescriptionProps {
    title: string | null,
    subject: string | null,
    functions: string | null,
    year: string | null,
}

const GalleryDescription : React.FC<GalleryDescriptionProps> = ({title, subject, functions, year}) => {


    return ( 
    <div className={styles.textContainer}>
            <h1 className={styles.title}>
            {title}
            </h1>

            <h3 className={styles.subject}>
            {subject}
            </h3>
            <p className={styles.functions}> 
                {functions} 
            </p>
            <p className={styles.year}> 
                {year}
            </p>
    </div>);
}

export default GalleryDescription;