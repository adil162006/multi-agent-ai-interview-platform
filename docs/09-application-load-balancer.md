# 09 — Application Load Balancer

## Application role

The ALB is the intended public/backend entry point in the supplied architecture. It accepts configured listener traffic and forwards it to a Gateway target group. The Gateway—not the ALB—owns application URL-prefix routing to auth, resume, interview, roadmap, and billing services.

## Configuration not present

No listener ports/protocols, rules, certificates, target groups, target type, health-check path/port, stickiness, idle timeout, or ALB security-group rules are represented in this repository. Confirm all of them against the live AWS configuration.

## Expected operational chain

Client/CloudFront → ALB listener → selected Gateway target group → healthy gateway ECS task. Backend targets should not be inferred as separate ALB target groups. Target health and listener forwarding are deployment settings, not visible in Express routes.

For diagnostic steps see [19-monitoring-and-troubleshooting.md](19-monitoring-and-troubleshooting.md) and [diagrams/alb-gateway-flow.mmd](diagrams/alb-gateway-flow.mmd).
