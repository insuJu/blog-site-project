SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS delete_expired_deactivated_accounts
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY
DO
  DELETE FROM account
  WHERE status = 'DEACTIVATED'
  AND deactivated_at < DATE_SUB(NOW(), INTERVAL 7 DAY);
