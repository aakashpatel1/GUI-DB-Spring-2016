USE GMPT;

DROP TABLE IF EXISTS Authorization;
CREATE TABLE IF NOT EXISTS Authorization (
UserID	INT NOT NULL,
AuthorizationToken VARCHAR(255) NOT NULL,
ExpirationDate DATETIME,
LoginDate DATETIME,
LogoutDate DATETIME,
PRIMARY KEY(UserID, AuthorizationToken),
FOREIGN KEY (UserID) REFERENCES User(UserID)
);

DROP PROCEDURE IF EXISTS Login;
DELIMITER // 
CREATE PROCEDURE `Login` (IN UserNameVal VARCHAR(45), IN PasswordVal VARCHAR(45))
LANGUAGE SQL
DETERMINISTIC
COMMENT 'validates username and password in database'
BEGIN

DECLARE ReturnUserID INT;
DECLARE ReturnName INT;
DECLARE ReturnToken VARCHAR(36);

IF EXISTS (SELECT Name as name, UserID as userID FROM User WHERE UserName = UserNameVal AND Password = PasswordVal)
THEN
	SET 	ReturnUserID = (SELECT 	UserID
							FROM 	User 
							WHERE 	UserName = UserNameVal AND Password = PasswordVal);
							SET 	ReturnToken = UUID();
	SET 	ReturnName =   (SELECT 	Name
							FROM 	User 
							WHERE 	UserName = UserNameVal AND Password = PasswordVal);
							SET 	ReturnToken = UUID();
	
	INSERT INTO Authorization (UserID, AuthorizationToken, LoginDate,  ExpirationDate)
	VALUES (ReturnUserID, ReturnToken, NOW(), DATE_ADD(NOW(),INTERVAL 5 MINUTE));

	SELECT ReturnUserID as userID, ReturnToken AS token, ReturnName as name;
END IF;

END//

DELIMITER ;

DROP PROCEDURE IF EXISTS Logout;
DELIMITER // 
CREATE PROCEDURE `Logout` (IN Token VARCHAR(36))
LANGUAGE SQL
DETERMINISTIC
COMMENT 'validates username and password in database'
BEGIN
	UPDATE	Authorization
	SET 	LogoutDate = NOW()
	WHERE 	AuthorizationToken = Token;
	SELECT 	"True" as status;
END//


