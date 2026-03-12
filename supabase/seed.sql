-- ClawBuilt Seed Data (test/development only)

-- Sample licenses
insert into licenses (email, stripe_customer_id, stripe_session_id, vertical, tier, harness, addons)
values
  ('demo-dental@example.com', 'cus_test_dental_001', 'cs_test_dental_starter', 'dental', 'starter', 'hermes', '[]'::jsonb),
  ('demo-dental-pro@example.com', 'cus_test_dental_002', 'cs_test_dental_pro', 'dental', 'pro', 'hermes', '[{"service": "guided-setup", "price": 597}]'::jsonb),
  ('demo-style@example.com', 'cus_test_style_001', 'cs_test_style_agency', 'style', 'agency', 'hermes', '[{"service": "done-install", "price": 2497}]'::jsonb),
  ('demo-trades@example.com', 'cus_test_trades_001', 'cs_test_trades_pro', 'trades', 'pro', 'hermes', '[]'::jsonb);

-- Sample subscription
insert into subscriptions (email, stripe_customer_id, stripe_subscription_id, plan, status, hours_included, hours_used_this_month, current_period_start, current_period_end)
values
  ('demo-dental@example.com', 'cus_test_dental_001', 'sub_test_watchdog', 'watchdog', 'active', 2, 0, now(), now() + interval '1 month'),
  ('demo-style@example.com', 'cus_test_style_001', 'sub_test_guardian', 'guardian', 'active', 5, 1, now(), now() + interval '1 month');

-- Sample block hours
insert into block_hours (email, stripe_customer_id, hours_purchased, hours_used, purchase_price, expires_at)
values
  ('demo-trades@example.com', 'cus_test_trades_001', 10, 2, 110000, now() + interval '12 months');
