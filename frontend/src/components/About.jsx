
const About = () => {
  return (
    <>
      <section className="about" id="about">
        <div className="container">
          <div className="banner">
            <div className="top">
              <h1 className="heading">ABOUT US</h1>
              <p>The only thing we&apos;re serious about is food.</p>
            </div>
            <p className="mid">
              Welcome to <strong>DineEase</strong>—where great dining experiences begin! 🍽️  
              At <strong>DineEase</strong>, we believe that reserving a table should be as enjoyable as the meal itself. Whether you&apos;re planning a romantic dinner, a family gathering, or a casual lunch with friends, we make the process seamless, quick, and hassle-free.
            </p>
            <ul className="mid">
              <li><strong>Why Choose DineEase?</strong></li>
              <li>✅ <strong>Instant Reservations</strong> – Book a table with just a few clicks.</li>
              <li>✅ <strong>Wide Restaurant Network</strong> – Discover and reserve at top-rated restaurants.</li>
              <li>✅ <strong>Real-Time Availability</strong> – No more long waits or last-minute disappointments.</li>
              <li>✅ <strong>Exclusive Deals</strong> – Enjoy special offers and discounts on selected restaurants.</li>
            </ul>
            
          </div>
          <div className="banner">
            <img src="about.png" alt="about" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
