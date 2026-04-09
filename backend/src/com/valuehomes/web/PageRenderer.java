package com.valuehomes.web;

import com.valuehomes.model.PersonalizedPlan;
import com.valuehomes.model.PropertyListing;
import com.valuehomes.model.PropertySubmission;
import com.valuehomes.model.Recommendation;
import com.valuehomes.util.HtmlUtils;

import java.util.List;

public class PageRenderer {
    public String renderHome(List<Recommendation> recommendations,
                             List<PropertyListing> listings,
                             List<PropertySubmission> submissions,
                             PersonalizedPlan plan,
                             String flashMessage) {
        StringBuilder html = new StringBuilder();
        html.append("""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>ValueHomes India</title>
                  <link rel="preconnect" href="https://fonts.googleapis.com">
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
                  <link rel="stylesheet" href="/assets/style.css">
                </head>
                <body>
                <header class="hero">
                  <nav class="topbar">
                    <div class="brand">ValueHomes India</div>
                    <div class="nav-links">
                      <a href="#ideas">Ideas</a>
                      <a href="#planner">Planner</a>
                      <a href="#admin">Admin</a>
                    </div>
                  </nav>
                  <div class="hero-grid">
                    <div>
                      <p class="eyebrow">Residential value enhancement for the Indian middle class</p>
                      <h1>Turn everyday homes into better investments.</h1>
                      <p class="hero-copy">Browse upgrade ideas, evaluate budget-friendly improvements, and generate tailored recommendations for apartments and family homes across Indian cities.</p>
                      <div class="stats">
                """);
        html.append("<div><strong>").append(recommendations.size()).append("</strong><span>improvement ideas</span></div>");
        html.append("<div><strong>").append(listings.size()).append("</strong><span>managed listings</span></div>");
        html.append("<div><strong>").append(submissions.size()).append("</strong><span>recent homeowner submissions</span></div>");
        html.append("""
                      </div>
                    </div>
                    <div class="hero-card">
                      <h2>What the platform supports</h2>
                      <ul>
                        <li>Admin tools to curate recommendations and listings</li>
                        <li>User-friendly property intake form for personalized planning</li>
                        <li>Budget-aware value uplift suggestions for middle-class buyers</li>
                      </ul>
                    </div>
                  </div>
                </header>
                <main class="container">
                """);

        if (flashMessage != null && !flashMessage.isBlank()) {
            html.append("<section class=\"flash\">").append(HtmlUtils.escape(flashMessage)).append("</section>");
        }

        html.append("""
                <section id="ideas" class="panel">
                  <div class="section-heading">
                    <div>
                      <p class="eyebrow">User View</p>
                      <h2>Property enhancement ideas</h2>
                    </div>
                    <p>High-impact ideas selected for value, practicality, and appeal in Indian residential markets.</p>
                  </div>
                  <div class="card-grid">
                """);
        for (Recommendation recommendation : recommendations) {
            html.append("<article class=\"idea-card\">")
                    .append("<div class=\"tag-row\"><span>").append(HtmlUtils.escape(recommendation.category())).append("</span><span>")
                    .append(HtmlUtils.escape(recommendation.investmentLevel())).append(" investment</span></div>")
                    .append("<h3>").append(HtmlUtils.escape(recommendation.title())).append("</h3>")
                    .append("<p>").append(HtmlUtils.escape(recommendation.description())).append("</p>")
                    .append("<dl>")
                    .append("<div><dt>Impact score</dt><dd>").append(recommendation.impactScore()).append("/100</dd></div>")
                    .append("<div><dt>Best for</dt><dd>").append(HtmlUtils.escape(recommendation.suitableFor())).append("</dd></div>")
                    .append("</dl>")
                    .append("<div class=\"benefits\">").append(renderBenefits(recommendation.benefits())).append("</div>")
                    .append("</article>");
        }
        html.append("""
                  </div>
                </section>

                <section class="panel">
                  <div class="section-heading">
                    <div>
                      <p class="eyebrow">Managed Listings</p>
                      <h2>Residential inventory</h2>
                    </div>
                    <p>Sample listings that admins can maintain to align recommendations with active properties.</p>
                  </div>
                  <div class="listing-grid">
                """);
        for (PropertyListing listing : listings) {
            html.append("<article class=\"listing-card\">")
                    .append("<span class=\"listing-status\">").append(HtmlUtils.escape(listing.status())).append("</span>")
                    .append("<h3>").append(HtmlUtils.escape(listing.headline())).append("</h3>")
                    .append("<p>").append(HtmlUtils.escape(listing.area())).append(", ").append(HtmlUtils.escape(listing.city())).append("</p>")
                    .append("<div class=\"listing-meta\">")
                    .append("<span>").append(listing.bhk()).append(" BHK</span>")
                    .append("<span>").append(HtmlUtils.escape(listing.propertyType())).append("</span>")
                    .append("<span>Rs ").append(listing.budgetLakhs()).append("L</span>")
                    .append("</div>")
                    .append("</article>");
        }
        html.append("""
                  </div>
                </section>

                <section id="planner" class="panel planner">
                  <div class="section-heading">
                    <div>
                      <p class="eyebrow">Personalized Recommendations</p>
                      <h2>Submit your property details</h2>
                    </div>
                    <p>Users can describe the home, budget, and current issues to receive focused upgrade suggestions.</p>
                  </div>
                  <div class="planner-layout">
                    <form class="planner-form" method="post" action="/user/submit">
                      <label>Owner name<input type="text" name="ownerName" required></label>
                      <label>City<input type="text" name="city" required></label>
                      <label>Property type
                        <select name="propertyType">
                          <option>Apartment</option>
                          <option>Independent House</option>
                          <option>Builder Floor</option>
                        </select>
                      </label>
                      <label>BHK<input type="number" min="1" max="6" name="bhk" required></label>
                      <label>Budget (Lakhs)<input type="number" min="10" max="500" name="budgetLakhs" required></label>
                      <label>Priorities<textarea name="priorities" rows="4" placeholder="Example: better resale value, more storage, stronger rental demand"></textarea></label>
                      <label>Current issues<textarea name="currentIssues" rows="4" placeholder="Example: outdated bathroom, weak entry appeal, dark kitchen"></textarea></label>
                      <button type="submit">Generate recommendations</button>
                    </form>
                """);

        if (plan != null) {
            html.append("<aside class=\"plan-card\">")
                    .append("<p class=\"eyebrow\">Custom plan for ").append(HtmlUtils.escape(plan.submission().ownerName())).append("</p>")
                    .append("<h3>Projected value uplift: ").append(plan.projectedValueBoost()).append("%</h3>")
                    .append("<p>").append(HtmlUtils.escape(plan.summary())).append("</p>");
            for (Recommendation recommendation : plan.recommendations()) {
                html.append("<div class=\"plan-item\">")
                        .append("<h4>").append(HtmlUtils.escape(recommendation.title())).append("</h4>")
                        .append("<p>").append(HtmlUtils.escape(recommendation.description())).append("</p>")
                        .append("<span>").append(HtmlUtils.escape(recommendation.investmentLevel())).append(" investment | Impact ")
                        .append(recommendation.impactScore()).append("</span>")
                        .append("</div>");
            }
            html.append("</aside>");
        } else {
            html.append("""
                    <aside class="plan-card empty">
                      <p class="eyebrow">Custom plan</p>
                      <h3>Your results will appear here</h3>
                      <p>Submit the form with property details to see a tailored shortlist of value-enhancing improvements.</p>
                    </aside>
                    """);
        }

        html.append("""
                  </div>
                </section>

                <section id="admin" class="panel admin-panel">
                  <div class="section-heading">
                    <div>
                      <p class="eyebrow">Admin Console</p>
                      <h2>Curate recommendations and listings</h2>
                    </div>
                    <p>Simple controls for updating the idea library, active listings, and reviewing user submissions.</p>
                  </div>
                  <div class="admin-grid">
                    <div class="admin-card">
                      <h3>Add recommendation</h3>
                      <form method="post" action="/admin/recommendations">
                        <label>Title<input type="text" name="title" required></label>
                        <label>Category<input type="text" name="category" required></label>
                        <label>Investment level
                          <select name="investmentLevel">
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        </label>
                        <label>Impact score<input type="number" min="1" max="100" name="impactScore" required></label>
                        <label>Suitable for<input type="text" name="suitableFor" required></label>
                        <label>Description<textarea name="description" rows="4" required></textarea></label>
                        <label>Benefits<textarea name="benefits" rows="3" placeholder="Separate key benefits with semicolons" required></textarea></label>
                        <button type="submit">Save recommendation</button>
                      </form>
                    </div>
                    <div class="admin-card">
                      <h3>Add listing</h3>
                      <form method="post" action="/admin/listings">
                        <label>Headline<input type="text" name="headline" required></label>
                        <label>City<input type="text" name="city" required></label>
                        <label>Area<input type="text" name="area" required></label>
                        <label>Property type<input type="text" name="propertyType" required></label>
                        <label>BHK<input type="number" min="1" max="6" name="bhk" required></label>
                        <label>Budget (Lakhs)<input type="number" min="10" max="500" name="budgetLakhs" required></label>
                        <label>Status<input type="text" name="status" value="Active" required></label>
                        <button type="submit">Save listing</button>
                      </form>
                    </div>
                  </div>
                  <div class="admin-grid lower">
                    <div class="admin-card wide">
                      <h3>Recommendation library</h3>
                      <div class="table-list">
                """);
        for (Recommendation recommendation : recommendations) {
            html.append("<div class=\"row\">")
                    .append("<div><strong>").append(HtmlUtils.escape(recommendation.title())).append("</strong><span>")
                    .append(HtmlUtils.escape(recommendation.category())).append(" | ").append(HtmlUtils.escape(recommendation.investmentLevel()))
                    .append("</span></div>")
                    .append("<form method=\"post\" action=\"/admin/recommendations/delete\">")
                    .append("<input type=\"hidden\" name=\"id\" value=\"").append(HtmlUtils.escape(recommendation.id())).append("\">")
                    .append("<button class=\"ghost\" type=\"submit\">Delete</button>")
                    .append("</form></div>");
        }
        html.append("""
                      </div>
                    </div>
                    <div class="admin-card wide">
                      <h3>Listings and user submissions</h3>
                      <div class="table-list">
                """);
        for (PropertyListing listing : listings) {
            html.append("<div class=\"row\">")
                    .append("<div><strong>").append(HtmlUtils.escape(listing.headline())).append("</strong><span>")
                    .append(HtmlUtils.escape(listing.city())).append(" | Rs ").append(listing.budgetLakhs()).append("L")
                    .append("</span></div>")
                    .append("<form method=\"post\" action=\"/admin/listings/delete\">")
                    .append("<input type=\"hidden\" name=\"id\" value=\"").append(HtmlUtils.escape(listing.id())).append("\">")
                    .append("<button class=\"ghost\" type=\"submit\">Delete</button>")
                    .append("</form></div>");
        }
        html.append("</div><h4>Recent submissions</h4><div class=\"submission-list\">");
        for (PropertySubmission submission : submissions) {
            html.append("<article>")
                    .append("<strong>").append(HtmlUtils.escape(submission.ownerName())).append("</strong>")
                    .append("<span>").append(HtmlUtils.escape(submission.city())).append(" | ")
                    .append(submission.bhk()).append(" BHK | Rs ").append(submission.budgetLakhs()).append("L</span>")
                    .append("<p>Priorities: ").append(HtmlUtils.escape(submission.priorities())).append("</p>")
                    .append("</article>");
        }
        html.append("""
                      </div>
                    </div>
                  </div>
                </section>
                </main>
                <script src="/assets/app.js"></script>
                </body>
                </html>
                """);
        return html.toString();
    }

    private String renderBenefits(String rawBenefits) {
        String[] items = rawBenefits.split(";");
        StringBuilder output = new StringBuilder();
        for (String item : items) {
            output.append("<span>").append(HtmlUtils.escape(item.trim())).append("</span>");
        }
        return output.toString();
    }
}
