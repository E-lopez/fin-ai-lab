import { useEffect, useRef } from "react";
import { useScroll } from "@/hooks/domEvents/useScroll";
import { footer } from "@/animations/home/footer/footer";
import { useMatchMedia } from "@/hooks/domEvents/useMatchMedia";
import logo_1 from '@assets/logo_1.png';


const Heading = () => {  
  const targetRef: any = useRef();
  const { scrollTop, scrollDir, scrolledProp } = useScroll();
  const { query } = useMatchMedia();

  useEffect(() => {
    footer(targetRef, scrollDir, scrolledProp, query);
  }, [scrollTop]);

  return(
    <div className="footer" ref={targetRef}>
      <img src={logo_1} alt={'kredit logo'} />
      <div className="footer__text u-mt-10">
        <p className="label u-center-text">k<span className="blue">r</span>edi Colombia</p>
        <p className="label u-center-text">© 2025 All rights reserved</p>
      </div>
      <div className="footer__socials">
        <a href="https://www.linkedin.com/company/kredit-app/" target="_blank" rel="noreferrer">
          <i className="bi-linkedin"></i>
        </a>
      </div>
    </div>
  )
}

export default Heading;
