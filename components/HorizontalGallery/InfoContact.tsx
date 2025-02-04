export default function Coffee() {
    return (

        <div style={{
            maxWidth: '600px',
            marginLeft: '25px',
            marginRight: '25px',
            marginBottom: '25px',
            marginTop: '10px',
            padding: "20px",
            backgroundColor: '#f5f6f2',
            background: '#f5f6f2',
            //background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
            borderRadius: '4px', // Slightly rounded corners for a card-like effect
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.25)', // More shadow at the bottom
            border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
            {/* <h3 style={{ textAlign: 'center' }}>INFO/CONTACT</h3> */}
            <p style={{
                textAlign: 'center',
                fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
                fontFamily: "'Georgia', serif", // Adds a slightly "printed" look
                color: "#525050", // Softer than pure black
                letterSpacing: "0.5px", // Tiny spacing for a premium feel
                textShadow: "0px 1px 1px rgba(0, 0, 0, 0.5)" // Soft ink effect
            }}>Clover is a Global Creative Studio and Production Company founded in New York City by{' '}
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
                        display: 'block'
                    }} />
            </div>


        </div>
    )
}