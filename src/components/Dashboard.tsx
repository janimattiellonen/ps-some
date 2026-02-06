import { useNavigate } from "react-router-dom";
import * as stylex from "@stylexjs/stylex";

const FEATURES = [
  {
    id: "player",
    title: "Player Profile",
    description: "Create player profile cards for social media",
    route: "/player",
    templates: [
      { src: "/images/templates/player-profile-green.png", label: "Green" },
      { src: "/images/templates/player-profile-pink.png", label: "Pink" },
      { src: "/images/templates/player-profile-blue.png", label: "Blue" },
      { src: "/images/templates/player-profile-golden.png", label: "Golden" },
      { src: "/images/templates/player-profile-gray.png", label: "Gray" },
    ],
  },
  {
    id: "scores",
    title: "Competition Scores",
    description: "Share competition results and leaderboards",
    route: "/scores",
    templates: [
      { src: "/images/templates/scores-blue.png", label: "Blue" },
      { src: "/images/templates/scores-green.png", label: "Green" },
    ],
  },
  {
    id: "scores2",
    title: "Competition Scores 2",
    description: "Share competition results and leaderboards",
    route: "/scores2",
    templates: [
      { src: "/images/templates/scores-blue.png", label: "Blue" },
      { src: "/images/templates/scores-green.png", label: "Green" },
    ],
  },
  {
    id: "event",
    title: "Event Poster",
    description: "Create event announcement posters",
    route: "/event",
    templates: [{ src: "/images/templates/oittaa.png", label: "Forest" }],
  },
] as const;

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "1fr",
      "@media (min-width: 768px)": "repeat(2, 1fr)",
    },
    gap: "2rem",
    maxWidth: "900px",
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    padding: "1.5rem",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px -8px rgba(0, 0, 0, 0.15)",
    },
    ":focus": {
      outline: "3px solid #2563eb",
      outlineOffset: "2px",
    },
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  cardDescription: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1.5rem",
  },
  templatesContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    justifyContent: "center",
    maxWidth: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  templatePreview: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  templateImage: {
    width: 80,
    height: "auto",
    borderRadius: "0.375rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  templateLabel: {
    fontSize: "0.75rem",
    color: "#9ca3af",
    fontWeight: "500",
  },
});

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div {...stylex.props(styles.container)}>
      <header {...stylex.props(styles.header)}>
        <h1 {...stylex.props(styles.title)}>Puskis Social Media</h1>
        <p {...stylex.props(styles.subtitle)}>Create social media images for disc golf events</p>
      </header>

      <div {...stylex.props(styles.grid)}>
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              void navigate(feature.route);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                void navigate(feature.route);
              }
            }}
            {...stylex.props(styles.card)}
            aria-label={`Go to ${feature.title}`}
          >
            <h2 {...stylex.props(styles.cardTitle)}>{feature.title}</h2>
            <p {...stylex.props(styles.cardDescription)}>{feature.description}</p>
            <div {...stylex.props(styles.templatesContainer)}>
              {feature.templates.map((template) => (
                <div key={template.label} {...stylex.props(styles.templatePreview)}>
                  <img
                    src={template.src}
                    alt={`${template.label} template preview`}
                    {...stylex.props(styles.templateImage)}
                  />
                  <span {...stylex.props(styles.templateLabel)}>{template.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
