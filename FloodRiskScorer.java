import java.util.*;

// ─────────────────────────────────────────────
//  FloodPath — Flood Risk Scorer (Java)
//  Converted from browser JavaScript source.
//  All scoring logic is identical to the JS.
// ─────────────────────────────────────────────

public class FloodRiskScorer {

    // ── Colours (hex strings, mirrors JS COLORS) ──────────────────
    public static final String COLOR_HIGH   = "#FF3B3B";
    public static final String COLOR_MEDIUM = "#FFE135";
    public static final String COLOR_LOW    = "#00C97A";

    // ── Risk levels ───────────────────────────────────────────────
    public enum Risk { HIGH, MEDIUM, LOW }

    // ── Drainage quality options ──────────────────────────────────
    public enum Drainage { poor, moderate, good }

    // ── Region type ───────────────────────────────────────────────
    public enum RegionType { urban, rural }

    // =================================================================
    //  ScoreResult  — mirrors the object returned by calcScore() in JS
    // =================================================================
    public static class ScoreResult {
        public final int total;   // 0–100
        public final Risk risk;   // HIGH / MEDIUM / LOW
        public final int e;       // elevation sub-score    (max 30)
        public final int d;       // distance sub-score     (max 30)
        public final int p;       // population sub-score   (max 20)
        public final int dr;      // drainage sub-score     (max 10)
        public final int x;       // region-specific score  (max 10)

        public ScoreResult(int total, Risk risk, int e, int d, int p, int dr, int x) {
            this.total = total;
            this.risk  = risk;
            this.e  = e;
            this.d  = d;
            this.p  = p;
            this.dr = dr;
            this.x  = x;
        }

        public String color() {
            switch (risk) {
                case HIGH:   return COLOR_HIGH;
                case MEDIUM: return COLOR_MEDIUM;
                default:     return COLOR_LOW;
            }
        }

        public String recommendationNote() {
            switch (risk) {
                case HIGH:
                    return "Immediate action required. Recommend flood barriers, " +
                           "early-warning systems, and evacuation planning.";
                case MEDIUM:
                    return "Moderate vulnerability. Consider drainage upgrades and " +
                           "community flood preparedness programs.";
                default:
                    return "Lower risk profile. Maintain current infrastructure and " +
                           "monitor seasonal water levels.";
            }
        }

        @Override
        public String toString() {
            return String.format(
                "ScoreResult{total=%d, risk=%s, elevation=%d, distance=%d, " +
                "population=%d, drainage=%d, regionFactor=%d}",
                total, risk, e, d, p, dr, x
            );
        }
    }

    // =================================================================
    //  calcScore()  — exact translation of the JS calcScore() function
    //
    //  @param elev   elevation in metres          (0 – 200+)
    //  @param dist   distance to water in km      (0 – 20+)
    //  @param dens   population density (ppl/km²) (0 – 10 000+)
    //  @param drain  drainage quality enum
    //  @param extra  urban → impervious surface % / rural → soil permeability %
    //  @param type   urban or rural
    // =================================================================
    public static ScoreResult calcScore(double elev, double dist, double dens,
                                        Drainage drain, double extra, RegionType type) {

        // Elevation score: lower = riskier (max 30)
        int e = (int) Math.round(30.0 * (1.0 - Math.min(elev / 200.0, 1.0)));

        // Distance-to-water score: closer = riskier (max 30)
        int d = (int) Math.round(30.0 * Math.max(0.0, 1.0 - dist / 20.0));

        // Population density score: denser = riskier (max 20)
        int p = (int) Math.round(20.0 * Math.min(dens / 10000.0, 1.0));

        // Drainage score (max 10)
        int dr;
        switch (drain) {
            case poor:     dr = 10; break;
            case moderate: dr =  5; break;
            default:       dr =  0; break;  // good
        }

        // Region-specific score (max 10)
        // Urban: high impervious surface → riskier
        // Rural: low soil permeability  → riskier
        int x = (type == RegionType.urban)
                ? (int) Math.round(10.0 * (extra / 100.0))
                : (int) Math.round(10.0 * (1.0 - extra / 100.0));

        int total = e + d + p + dr + x;

        Risk risk = (total >= 60) ? Risk.HIGH
                  : (total >= 35) ? Risk.MEDIUM
                  :                 Risk.LOW;

        return new ScoreResult(total, risk, e, d, p, dr, x);
    }

    // =================================================================
    //  Zone  — mirrors the ZONES array objects in JS
    // =================================================================
    public static class Zone {
        public final String     name;
        public final double     elev;   // metres
        public final double     dist;   // km to water
        public final double     dens;   // population density
        public final Drainage   drain;
        public final double     extra;  // impervious % or permeability %
        public final RegionType type;

        public Zone(String name, double elev, double dist, double dens,
                    Drainage drain, double extra, RegionType type) {
            this.name  = name;
            this.elev  = elev;
            this.dist  = dist;
            this.dens  = dens;
            this.drain = drain;
            this.extra = extra;
            this.type  = type;
        }

        public ScoreResult score() {
            return calcScore(elev, dist, dens, drain, extra, type);
        }

        @Override
        public String toString() {
            ScoreResult r = score();
            return String.format("%-22s | %-6s | Score: %3d/100 | %s",
                name, type, r.total, r.risk);
        }
    }

    // =================================================================
    //  ZONES  — identical to the JS ZONES array
    // =================================================================
    public static final List<Zone> ZONES = Arrays.asList(
        new Zone("Riverside District", 6,   0.4, 8200, Drainage.poor,     78, RegionType.urban),
        new Zone("Hillcrest Zone",     145, 22,  800,  Drainage.good,     25, RegionType.rural),
        new Zone("Lakefront East",     11,  1.2, 5400, Drainage.moderate, 65, RegionType.urban),
        new Zone("Northfields Rural",  60,  8,   300,  Drainage.moderate, 40, RegionType.rural),
        new Zone("Central District",   22,  3.5, 9100, Drainage.poor,     85, RegionType.urban)
    );

    // =================================================================
    //  ZonePrinter  — mirrors renderZones() in JS
    // =================================================================
    public static void renderZones() {
        System.out.println("═══════════════════════════════════════════════════════");
        System.out.println("  FLOODPATH — Zone Risk Overview");
        System.out.println("═══════════════════════════════════════════════════════");
        for (Zone z : ZONES) {
            ScoreResult r = z.score();
            System.out.println(z);
            // ASCII progress bar (mirrors zc-bar)
            int bars = r.total / 5;
            System.out.printf("  [%-20s] %d/100%n",
                "█".repeat(bars) + " ".repeat(20 - bars), r.total);
            System.out.printf("  Note: %s%n%n", r.recommendationNote());
        }
    }

    // =================================================================
    //  CTA validator  — mirrors submitCta() in JS
    // =================================================================
    public static boolean validateEmail(String email) {
        if (email == null || email.isBlank()) return false;
        return email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }

    // =================================================================
    //  Demo entry point — mirrors setTimeout(liveAssess, 400) in JS
    // =================================================================
    public static void main(String[] args) {
        // Print all preset zones
        renderZones();

        // Live demo — custom assessment (mirrors the interactive slider defaults)
        System.out.println("─────────────────────────────────────────────────────");
        System.out.println("  Live Assessment (Urban defaults)");
        System.out.println("─────────────────────────────────────────────────────");

        double elev  = 22;
        double dist  = 3.5;
        double dens  = 9100;
        Drainage drain = Drainage.poor;
        double extra = 85;
        RegionType type = RegionType.urban;

        ScoreResult result = calcScore(elev, dist, dens, drain, extra, type);

        System.out.printf("  Region type : %s%n", type);
        System.out.printf("  Elevation   : %.0f m%n", elev);
        System.out.printf("  Water dist  : %.1f km%n", dist);
        System.out.printf("  Pop. density: %.0f /km²%n", dens);
        System.out.printf("  Drainage    : %s%n", drain);
        System.out.printf("  Imp. surface: %.0f%%%n", extra);
        System.out.println();
        System.out.printf("  ── Sub-scores ──────────────────%n");
        System.out.printf("  Elevation factor   : %2d / 30%n", result.e);
        System.out.printf("  Water proximity    : %2d / 30%n", result.d);
        System.out.printf("  Population density : %2d / 20%n", result.p);
        System.out.printf("  Drainage quality   : %2d / 10%n", result.dr);
        System.out.printf("  Region-specific    : %2d / 10%n", result.x);
        System.out.printf("  ────────────────────────────────%n");
        System.out.printf("  TOTAL SCORE : %d / 100%n", result.total);
        System.out.printf("  RISK LEVEL  : %s%n", result.risk);
        System.out.printf("  COLOR       : %s%n", result.color());
        System.out.printf("  NOTE        : %s%n", result.recommendationNote());

        // Email validation demo (mirrors submitCta)
        System.out.println();
        System.out.println("─────────────────────────────────────────────────────");
        System.out.println("  Email Validation Demo");
        System.out.println("─────────────────────────────────────────────────────");
        String[] emails = {"user@example.com", "bad-email", "", "test@domain.org"};
        for (String email : emails) {
            System.out.printf("  %-25s → %s%n", email,
                validateEmail(email) ? "✓ valid" : "✗ invalid");
        }
    }
}
