import classes from "./Contact.module.css";
import {
  Mail,
  User,
  PhoneLink,
  EmailLink,
} from "../../components/UI/svgs/svgs";
import FAQs from "../../components/Faqs";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { message } from "antd";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_je05kl9",
        "template_2ft9dno",
        form.current,
        "f3heQFk_ycb7UsDKq"
      )
      .then(
        (result) => {
          console.log(result.text);
          message.success("thanks for reaching out we'll get back to you soon");
          form.current.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className={classes.contact}>
      <h4>Contact Us</h4>
      <h5>We are available to attend to your issues</h5>
      <br />

      <p>
        We are interested in hearing your thoughts. We accept all inquiries and
        unique requests. Send us a message if you have any <br />
        questions, concerns or inquiry
      </p>
      <form ref={form} onSubmit={sendEmail}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input
            name="from_email"
            type="email"
            id="email"
            placeholder="faitholu@gmail.com"
          />
          <i>{Mail}</i>
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            name="from_name"
            type="text"
            id="username"
            placeholder="kaizen.brand"
          />
          <i>{User}</i>
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            rows="10"
            placeholder="Say something"
            id="message"
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit">Send</button>
        </div>
      </form>
      <div className="mt-5 ">
        <h4 className="text-center">Get in Touch</h4>
        <div className={`${classes.links} `}>
          <a href="mailto:travaye@gmail.com">
            <div className="py-4">
              <i>{EmailLink}</i>
              <p>
                Email Address <br />
                <i> travaye@gmail.com</i>
              </p>
            </div>
          </a>
          <a href="tel:+234567823433">
            <div className="py-4">
              <i>{PhoneLink}</i>
              <p>
                Contact <br />
                <i> +234 5678-234-33</i>
              </p>
            </div>
          </a>
        </div>
      </div>
      <div>
        <h4 className="text-center">Freuently Asked Questions (FAQs)</h4>
        <p>
          Here’s a few answers to some questions you might have in mind. If your
          questions are different from this, feel free to contact us using the
          form above.
        </p>
        <div className="d-flex flex-column align-items-center">
          {faqs.map(({ question, answer }, i) => {
            return <FAQs key={i} question={question} answer={answer} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Contact;

const faqs = [
  {
    question: "What is Travayé?",
    answer:
      "Travaye is a lifestyle and tourism brand that utilises the power of technology and tourism to connect the adventurous with the best deals and experiences, creating a seamless journey from start to finish."
  },
  {
    question: "How does travaye work?",
    answer:
      "Our platform allows users to easily find places to go based on their budget, location, and outing category, so they can make smarter decisions about their leisure activities without breaking the bank. Our platform also helps businesses earn visibility and make money, by automatically suggesting their services to users who fit their niche, making it easier to expand their customer base and grow their brand."
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can do this by either filling out our compliant form on the “Contact Us” Page, Or Reaching out to us directly through our in app customer support chat box.",
  },
  {
    question: "Is this platform free?",
    answer:
      "YES it is free for Personal Users. Business users will be required to pay a subscription fee, However; it is currently free for new businesses as we are presently still in our pre launch phase.",
  },
];
