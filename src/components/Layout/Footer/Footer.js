import classes from "./Footer.module.css";
import WhiteLogo from "../../../assets/white-logo.png";
import { FacebookIcon, TwitterIcon, InstaIcon } from "../../UI/svgs/svgs";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { message } from "antd";
import { useSelector } from "react-redux";

const Links = [
  { name: "My Account", href: "/user" },
  { name: "View Locations", href: "/business-locations" },
  { name: "Watch Stories", href: "/" },
];

const Footer = () => {
  const form = useRef();
  const userData = useSelector((state) => state.auth.user);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.send(
      "service_2awgc2q",
      "template_56hvrxa",
      {
        username: userData?.username || "New user",
        message: "I would love to join the Travaye waitlist",
        reply_to: form.current.from_email.value
      },
      "sJVfx0jMMQwTWPNnl"
    ).then(
      (result) => {
        console.log(result.text);
        message.success("thanks for reaching out we'll get back to you soon");
        form.current.reset();
      },
      (error) => {
        console.log(error.text);
        message.error(error.text);
      }
    );
  };

  return (
    <footer className={classes.footer}>
      <div className={classes.bgPicture} />
      <div className="flex justify-around flex-col gap-3 md:flex-row p-5">
        <div className="mb-4">
          <img src={WhiteLogo} alt="logo" className="img-fluid" />
          <p>
            Chop life on a budget,
            <br />
            Live free with Travaye
          </p>
          <div className={classes.socials}>
            {FacebookIcon}
            <a href="https://www.instagram.com/travaye_/"> {InstaIcon} </a>
            <a href="http://twitter.com/travaye_"> {TwitterIcon}</a>
          </div>
        </div>
        <div className="mb-5">
          <h4>Join Our Waitlist</h4>
          <form ref={form} onSubmit={sendEmail}>
            <input
              className="text-black"
              name="from_email"
              type="email"
              placeholder="Enter Your Email"
            />
            <button type="submit" className="md:mx-auto">
              <svg
                width="30"
                height="22"
                viewBox="0 0 36 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 11.0001H34M20 1.66675L34 11.0001L20 20.3334"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
        <div className="mb-4">
          <h4>Useful Links</h4>
          <ul>
            {Links.map(({ name, href }, i) => {
              return (
                <li key={i}>
                  <Link to={href} key={i}>
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div>
        <p>2022 Copyrights @ Travaye. All Rights reserved</p>
      </div>
    </footer>
  );
};
export default Footer;
