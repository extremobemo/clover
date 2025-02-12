import Image from "next/image";
import styles from "../../styles/NewInfoContact.module.css"

export default function NewInfoContact() {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <p className="text-lg font-medium">Clover is a Global Creative Studio and Production Company founded in New York City by{' '}
            <a
                href="https://www.youtube.com/watch?v=Xgc3tJmlYBE&t=103s"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#39993A', textDecoration: 'none', fontWeight: 'bold' }}
            >
                Cian Moore
            </a>.</p>
        <p> Built on a collective vision of bold, authentic work, Clover crafts innovative solutions that fuse artistry with cutting-edge execution.
        .</p>
        <p>No creative challenge is too bold, complex, or unconventional for Clover. Whatever the tone, or theme, we embrace the endeavor, thrive on pushing boundaries, and bringing visionary concepts to life.
        </p>

        <p >Clover: where execution meets imagination too extraordinary to be true. </p>

        <br></br>

        <p className={styles.contactText}>Reach us here:{' '}
            <a
                href="mailto:contact@clovernyc.com"
                style={{
                    color: '#39993A',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                }}
            >
                contact@clovernyc.com
            </a></p>
        
      </div>

      {/* Image at the bottom */}
      <div className={styles.bottomImage}>
        <Image
          src="/CloverStamp.png"// Replace with your image path
          alt="Bottom image"
          width={125} // Adjust as needed
          height={125} // Adjust as needed
          className="object-contain"
        />
      </div>
    </div>
  );
}