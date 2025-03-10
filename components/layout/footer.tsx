import Image from "next/image";

export default function Footer() {
  return (
    <footer style={styles.footerContainer}>
      {/* Background Wave Image */}
      <div style={styles.waveBackground}>
        <Image
          src="/layered-waves-buttom.svg"
          alt="Bottom wave"
          fill
          style={styles.waveImage}
          priority={false}
        />
      </div>

      {/* Footer Content */}
      <div style={styles.footerContent}>
        <p style={styles.footerName}>JaMoveo</p>
        <p style={styles.footerCopyright}>© 2025 Yahav Nir. All rights reserved.</p>
      </div>
    </footer>
  );
}

// Inline styles
const styles = {
  footerContainer: {
    position: "relative",
    width: "100%",
    height: "150px", // Adjust as needed
    display: "flex",
    opacity: "0.8",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "500",
    overflow: "hidden",
  } as React.CSSProperties,

  waveBackground: {
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: -1,
  } as React.CSSProperties,

  waveImage: {
    objectFit: "cover",
    objectPosition: "bottom",
    WebkitMaskImage:
      "linear-gradient(to top, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
    maskImage:
      "linear-gradient(to top, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
  } as React.CSSProperties,

  footerContent: {
    position: "relative",
    zIndex: 1,
  } as React.CSSProperties,

  footerName: {
    fontSize: "18px",
    fontWeight: "bold",
  } as React.CSSProperties,

  footerCopyright: {
    fontSize: "14px",
    opacity: "0.8",
  } as React.CSSProperties,
};

