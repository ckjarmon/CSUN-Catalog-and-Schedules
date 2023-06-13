
DROP TABLE IF EXISTS "section";
CREATE TABLE "section" (
  "class_number" int NOT NULL,
  "enrollment_cap" int DEFAULT NULL,
  "enrollment_count" int DEFAULT NULL,
  "instructor" varchar(100) DEFAULT NULL,
  "days" varchar(5) DEFAULT NULL,
  "location" varchar(60) DEFAULT NULL,
  "start_time" char(5) DEFAULT NULL,
  "end_time" char(5) DEFAULT NULL,
  "catalog_number" varchar(10) NOT NULL,
  "subject" varchar(6) NOT NULL,
  "waitlist_cap" int DEFAULT NULL,
  "waitlist_count" int DEFAULT NULL,
  "semester" varchar(6) NOT NULL,
  "year" int NOT NULL,
  PRIMARY KEY ("class_number","subject","catalog_number", "semester", "year"),
  CONSTRAINT "ck_semester" CHECK (("semester" in ('summer','fall','spring','winter')))
);




