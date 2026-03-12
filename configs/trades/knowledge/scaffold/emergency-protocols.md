# {{COMPANY_NAME}} — Emergency Protocols

<!--
  INSTRUCTIONS: This is a CRITICAL document. Fill in every field.
  The agent uses this to route emergencies to the right person.
  An incorrect phone number or outdated on-call rotation means
  a customer with no heat at 2am gets no response.

  Review and update this document MONTHLY.
  Last reviewed: {{LAST_REVIEW_DATE}}
-->

## Emergency Definition

An emergency is any situation that:
- Poses an immediate safety risk (gas leak, CO, electrical fire)
- Will cause significant property damage if not addressed quickly (flooding, burst pipe)
- Leaves the customer without an essential service in dangerous conditions (no heat in freezing temps, no AC in extreme heat with vulnerable occupants)

---

## Emergency Phone Line

- **Emergency number:** {{EMERGENCY_PHONE}}
- **Available:** 24/7/365
- **Callback SLA:** {{EMERGENCY_CALLBACK_SLA}} minutes

---

## On-Call Technician Rotation

### Current On-Call Schedule

| Day | Primary On-Call | Phone | Backup On-Call | Phone |
|---|---|---|---|---|
| Monday | {{TECH_MON}} | {{PHONE_MON}} | {{BACKUP_MON}} | {{BACKUP_PHONE_MON}} |
| Tuesday | {{TECH_TUE}} | {{PHONE_TUE}} | {{BACKUP_TUE}} | {{BACKUP_PHONE_TUE}} |
| Wednesday | {{TECH_WED}} | {{PHONE_WED}} | {{BACKUP_WED}} | {{BACKUP_PHONE_WED}} |
| Thursday | {{TECH_THU}} | {{PHONE_THU}} | {{BACKUP_THU}} | {{BACKUP_PHONE_THU}} |
| Friday | {{TECH_FRI}} | {{PHONE_FRI}} | {{BACKUP_FRI}} | {{BACKUP_PHONE_FRI}} |
| Saturday | {{TECH_SAT}} | {{PHONE_SAT}} | {{BACKUP_SAT}} | {{BACKUP_PHONE_SAT}} |
| Sunday | {{TECH_SUN}} | {{PHONE_SUN}} | {{BACKUP_SUN}} | {{BACKUP_PHONE_SUN}} |

### Holiday Coverage

| Holiday | On-Call Tech | Phone |
|---|---|---|
| {{HOLIDAY_1}} | {{TECH}} | {{PHONE}} |
| {{HOLIDAY_2}} | {{TECH}} | {{PHONE}} |

---

## Escalation Chain

If the primary on-call tech does not respond within {{PRIMARY_RESPONSE_MINUTES}} minutes:

1. **Try primary tech again** (call, not just text)
2. **Contact backup tech** ({{BACKUP_RESPONSE_MINUTES}} minute window)
3. **Contact office manager:** {{OFFICE_MANAGER_NAME}} — {{OFFICE_MANAGER_PHONE}}
4. **Contact owner:** {{OWNER_NAME}} — {{OWNER_PHONE}}

**Total maximum time from customer contact to live human response: {{MAX_ESCALATION_MINUTES}} minutes**

---

## Emergency Types and Specific Protocols

### Gas Leak / Gas Smell

1. **Agent tells customer:** "If you smell gas, leave the building immediately. Do not turn on any lights or use any electrical switches. Call 911 from outside. Once you are safe, we will dispatch a technician."
2. **Agent escalates to:** On-call tech + office manager simultaneously
3. **Response SLA:** Immediate callback, technician on-site within {{GAS_LEAK_ONSITE_MINUTES}} minutes if possible
4. **Agent does NOT:** Suggest the customer investigate, check the stove, or try to find the leak

### Carbon Monoxide

1. **Agent tells customer:** "If your CO detector is going off, get everyone out of the house immediately — including pets. Call 911 from outside. Do not go back inside until the fire department clears it."
2. **Agent asks:** "Is everyone out of the house? Is anyone feeling dizzy, nauseous, or having headaches?"
3. **If symptoms reported:** Emphasize calling 911 immediately for medical evaluation
4. **Agent escalates to:** On-call tech + office manager simultaneously

### Flooding / Burst Pipe

1. **Agent tells customer:** "Can you locate and turn off your main water shutoff valve? It's usually near where the water line enters your home — often in the basement, crawl space, or near the water heater."
2. **Agent asks:** "How much water are we talking about? Is it contained to one area or spreading?"
3. **Agent escalates to:** On-call plumber
4. **Response SLA:** Callback within {{EMERGENCY_CALLBACK_SLA}} minutes, on-site within {{FLOOD_ONSITE_MINUTES}} minutes

### No Heat (Freezing Conditions)

1. **Agent asks:** "What's the temperature outside right now? How cold is it inside the house?"
2. **Agent asks:** "Is anyone elderly, an infant, or medically vulnerable in the home?"
3. **Agent suggests (if safe):** "In the meantime, if you have a space heater, use it in one room and keep the door closed to retain heat. Open cabinet doors under sinks to prevent pipe freezing."
4. **Agent escalates to:** On-call HVAC tech
5. **Response SLA:** Callback within {{EMERGENCY_CALLBACK_SLA}} minutes

### No AC (Extreme Heat)

1. **Agent asks:** "How hot is it? Is anyone elderly, very young, or medically vulnerable in the home?"
2. **If vulnerable occupants in 95F+:** Treat as emergency
3. **If no vulnerable occupants and temp is manageable:** May offer next-day priority service instead of emergency dispatch
4. **Agent suggests:** "Stay hydrated and try to cool down with fans. If anyone feels dizzy or nauseous from the heat, call 911."

### Sewer Backup

1. **Agent asks:** "Is sewage coming up through drains or into the home?"
2. **Agent warns:** "Avoid contact with the water — it can contain harmful bacteria. Keep children and pets away from the affected area."
3. **Agent escalates to:** On-call plumber
4. **Response SLA:** Callback within {{EMERGENCY_CALLBACK_SLA}} minutes

---

## After-Hours Emergency Pricing

- After-hours emergency service call fee: ${{AFTER_HOURS_EMERGENCY_FEE}}
- **Agent does NOT quote this proactively.** If the customer asks about cost, say: "There is an after-hours service fee. Our dispatcher will discuss pricing when they call you back. Our priority right now is getting you help."

---

## Emergency Contact List (Internal)

| Role | Name | Phone | Email |
|---|---|---|---|
| Office Manager | {{NAME}} | {{PHONE}} | {{EMAIL}} |
| Owner | {{NAME}} | {{PHONE}} | {{EMAIL}} |
| HVAC Lead Tech | {{NAME}} | {{PHONE}} | {{EMAIL}} |
| Plumbing Lead Tech | {{NAME}} | {{PHONE}} | {{EMAIL}} |
| Electrical Lead Tech | {{NAME}} | {{PHONE}} | {{EMAIL}} |

---

## Monthly Review Checklist

- [ ] On-call rotation is current
- [ ] All phone numbers are correct
- [ ] Holiday coverage is scheduled
- [ ] Escalation chain contacts are correct
- [ ] Emergency callback SLA is realistic for current staffing
- [ ] After-hours pricing is current

**Reviewed by:** _______________  **Date:** _______________
