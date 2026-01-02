--  experiment (dev) --
SET GLOBAL event_scheduler = ON;

DELIMITER $$

CREATE EVENT IF NOT EXISTS delete_expired_deactivated_accounts
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
  DELETE FROM account
  WHERE status = 'DEACTIVATED'
    AND deactivated_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE);

  DELETE FROM profile
  WHERE id NOT IN (
    SELECT DISTINCT profile_id
    FROM account
    WHERE profile_id IS NOT NULL
  );
END$$

DELIMITER ;

-- production --
DELIMITER $$

ALTER EVENT delete_expired_deactivated_accounts
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
  DELETE FROM account
  WHERE status = 'DEACTIVATED'
    AND deactivated_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

  DELETE FROM profile
  WHERE id NOT IN (
    SELECT DISTINCT profile_id
    FROM account
    WHERE profile_id IS NOT NULL
  );
END$$

DELIMITER ;


