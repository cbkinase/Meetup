import "./Footer.css";

export default function Footer() {
    return (
        <div className="footer-container">
        <div className="footer">
            <div className="footer-pt-1">Created by&nbsp;
                <a className="footer-my-link" href="https://cbkinase.github.io/" target="_blank" rel="noreferrer">Cameron Beck</a>
            </div>

            <div className="footies">
                <div className="footer-link">
                    <span>
                        <a className="footer-button" href="https://github.com/cbkinase/Meetup" target="_blank"
                            rel="noreferrer">
                            <button className="link-info-button">
                                <i className="fa fa-github"></i>
                            </button>
                        </a>
                    </span>
                </div>

                <div className="footer-link">
                    <span>
                        <a className="footer-button" href="https://www.linkedin.com/in/cameron-beck-4a9a44274/" target="_blank"
                            rel="noreferrer">
                            <button className="link-info-button">
                                <i className="fa fa-linkedin-square"></i>
                            </button>
                        </a>
                    </span>
                </div>
            </div>
        </div>
    </div>
    )
}
