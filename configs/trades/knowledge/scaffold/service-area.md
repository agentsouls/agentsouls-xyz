# {{COMPANY_NAME}} — Service Area

<!--
  INSTRUCTIONS: List every zip code the company services.
  This is critical — the agent uses this list to verify whether a customer
  is in the service area. Missing a zip code means turning away a valid customer.

  Organize by zone for clarity. Add drive-time or trip charge notes as applicable.
-->

## Primary Service Area

**Region:** {{REGION_NAME}}
<!-- e.g., "Greater Dallas-Fort Worth", "Metro Atlanta", "Phoenix Valley" -->

### Core Zone (No additional trip charge)

| Zip Code | City/Neighborhood |
|---|---|
| {{ZIP_1}} | {{CITY_1}} |
| {{ZIP_2}} | {{CITY_2}} |
| {{ZIP_3}} | {{CITY_3}} |
| {{ZIP_4}} | {{CITY_4}} |
| {{ZIP_5}} | {{CITY_5}} |
| {{ZIP_6}} | {{CITY_6}} |
| {{ZIP_7}} | {{CITY_7}} |
| {{ZIP_8}} | {{CITY_8}} |
| {{ZIP_9}} | {{CITY_9}} |
| {{ZIP_10}} | {{CITY_10}} |
<!-- Add all core zip codes. Most trades companies serve 15-50 zip codes. -->

### Extended Zone (Additional trip charge: ${{EXTENDED_TRIP_FEE}})

<!-- Zip codes on the edge of the service area where an extra trip charge applies -->

| Zip Code | City/Neighborhood | Trip Charge |
|---|---|---|
| {{ZIP_EXT_1}} | {{CITY_EXT_1}} | ${{FEE}} |
| {{ZIP_EXT_2}} | {{CITY_EXT_2}} | ${{FEE}} |

### Not Serviced

<!-- Zip codes customers commonly ask about that are outside the service area.
     List them here so the agent can give a clear answer. -->

| Zip Code | City | Referral Partner |
|---|---|---|
| {{ZIP_NO_1}} | {{CITY_NO_1}} | {{REFERRAL_1}} |
| {{ZIP_NO_2}} | {{CITY_NO_2}} | {{REFERRAL_2}} |

---

## Drive-Time Limits

- Maximum drive time from shop: {{MAX_DRIVE_MINUTES}} minutes
- Shop address: {{SHOP_ADDRESS}}

---

## Commercial Service Area

<!-- If different from residential -->

Commercial service area: {{COMMERCIAL_AREA_DESCRIPTION}}
Additional commercial zones available by arrangement.

---

## Multi-Location Support

<!-- If the company has multiple locations, list each with its own service area -->

### Location 1: {{LOCATION_1_NAME}}
- Address: {{LOCATION_1_ADDRESS}}
- Zip codes served: {{LOCATION_1_ZIPS}}

### Location 2: {{LOCATION_2_NAME}}
- Address: {{LOCATION_2_ADDRESS}}
- Zip codes served: {{LOCATION_2_ZIPS}}

---

## Notes for Agent

- If a customer's zip code is not listed above, they are outside the service area.
- For borderline cases, offer service with the extended trip charge.
- For clearly out-of-area requests, recommend the listed referral partner.
- Commercial accounts may be serviced outside the standard area on a case-by-case basis — escalate to the commercial sales team.
