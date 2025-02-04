import styles from "../../styles/InfoContact.module.css"


export default function Coffee() {
    return (

        <div className={styles.businessCard} >
            {/* <h3 style={{ textAlign: 'center' }}>INFO/CONTACT</h3> */}
            <p className={styles.cardText}>Clover is a Global Creative Studio and Production Company founded in New York City by{' '}
                <a
                    href="https://www.youtube.com/watch?v=Xgc3tJmlYBE&t=103s"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0077cc', textDecoration: 'none', fontWeight: 'bold' }}
                >
                    Cian Moore
                </a>.
                Built on a collective vision of bold, authentic work, Clover crafts innovative solutions that fuse artistry with cutting-edge execution.

                <br /> <br />

                No creative challenge is too bold, complex, or unconventional for Clover. Whatever the tone, or theme, we embrace the endeavor, thrive on pushing boundaries, and bringing visionary concepts to life.

                <br /> <br />

                Clover: where execution meets imagination too extraordinary to be true.

                <br /> <br />

                #clovermode

                <br /> <br />

                Reach us here:{' '}
                <a
                    href="mailto:contact@clovernyc.com"
                    style={{
                        color: '#39993A',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    contact@clovernyc.com
                </a>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                    src="/CloverStamp.png"
                    alt="Clover NYC"
                    style={{
                        width: '100px',
                        display: 'block',
                        //marginBottom: '10px'
                    }} />
            </div>


        </div>
    )
}