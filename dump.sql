-- MySQL dump 10.13  Distrib 9.5.0, for macos26.2 (arm64)
--
-- Host: localhost    Database: database-1
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '54807f54-f5fb-11f0-bb1f-2d43ca2b78da:1-101';

--
-- Table structure for table `appversion`
--

DROP TABLE IF EXISTS `appversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appversion` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `appversion` varchar(100) NOT NULL COMMENT '앱버전',
  `isUpdate` tinyint(1) DEFAULT NULL COMMENT '업데이트 여부',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appversion`
--

LOCK TABLES `appversion` WRITE;
/*!40000 ALTER TABLE `appversion` DISABLE KEYS */;
/*!40000 ALTER TABLE `appversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `type` int NOT NULL COMMENT '타입형, 공지사항 0 기본 게시판 1 너반꿀 2',
  `name` varchar(100) NOT NULL COMMENT '게시판 이름 ex) 너반꿀, 자유',
  `address` varchar(100) NOT NULL COMMENT '게시판 핵심 주소 ex)nurban, free',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `information`
--

DROP TABLE IF EXISTS `information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `information` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `type` int NOT NULL COMMENT '타입형, 0이면 이용약관, 1이면 개인정보 처리방침',
  `content` text NOT NULL COMMENT '내용',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `information`
--

LOCK TABLES `information` WRITE;
/*!40000 ALTER TABLE `information` DISABLE KEYS */;
INSERT INTO `information` VALUES (1,1,'개인정보','2026-01-23 00:00:00','2026-01-23 00:00:00',NULL),(2,0,'이용약관','2026-01-23 00:00:00','2026-01-23 00:00:00',NULL);
/*!40000 ALTER TABLE `information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insignia`
--

DROP TABLE IF EXISTS `insignia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insignia` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `insignia` varchar(256) NOT NULL COMMENT '휘장 string으로 표현 ex) insigniaArticle10, insigniaArticle100',
  `isShown` tinyint(1) NOT NULL DEFAULT '0' COMMENT '휘장을 보여줄 휘장인지 아닌지 보여주는 필드',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `actions_unique` (`insignia`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `insignia_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insignia`
--

LOCK TABLES `insignia` WRITE;
/*!40000 ALTER TABLE `insignia` DISABLE KEYS */;
/*!40000 ALTER TABLE `insignia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(100) NOT NULL COMMENT '타이틀',
  `content` text NOT NULL COMMENT '콘텐츠',
  `count` int NOT NULL DEFAULT '0' COMMENT '조회수',
  `commentCount` int NOT NULL DEFAULT '0' COMMENT '댓글 갯수',
  `likeCount` int NOT NULL DEFAULT '0' COMMENT '좋아요 수',
  `dislikeCount` int NOT NULL DEFAULT '0' COMMENT '싫어요 수',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `notice_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice_comment`
--

DROP TABLE IF EXISTS `notice_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice_comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `content` text NOT NULL COMMENT '내용',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `noticeId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `noticeId` (`noticeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `notice_comment_ibfk_1` FOREIGN KEY (`noticeId`) REFERENCES `notice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `notice_comment_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice_comment`
--

LOCK TABLES `notice_comment` WRITE;
/*!40000 ALTER TABLE `notice_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice_dislike`
--

DROP TABLE IF EXISTS `notice_dislike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice_dislike` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `noticeId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `noticeId` (`noticeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `notice_dislike_ibfk_1` FOREIGN KEY (`noticeId`) REFERENCES `notice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `notice_dislike_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice_dislike`
--

LOCK TABLES `notice_dislike` WRITE;
/*!40000 ALTER TABLE `notice_dislike` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice_dislike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice_like`
--

DROP TABLE IF EXISTS `notice_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice_like` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `noticeId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `noticeId` (`noticeId`),
  KEY `userId` (`userId`),
  CONSTRAINT `notice_like_ibfk_1` FOREIGN KEY (`noticeId`) REFERENCES `notice` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `notice_like_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice_like`
--

LOCK TABLES `notice_like` WRITE;
/*!40000 ALTER TABLE `notice_like` DISABLE KEYS */;
/*!40000 ALTER TABLE `notice_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rank`
--

DROP TABLE IF EXISTS `rank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rank` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `totalLossCut` bigint NOT NULL DEFAULT '0' COMMENT '랭크 토탈 손실액',
  `totalLikeCount` int NOT NULL DEFAULT '0' COMMENT '랭크 토탈 좋아요 수(인정 수)',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `rank_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rank`
--

LOCK TABLES `rank` WRITE;
/*!40000 ALTER TABLE `rank` DISABLE KEYS */;
/*!40000 ALTER TABLE `rank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `total_comment`
--

DROP TABLE IF EXISTS `total_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `total_comment` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `board` int NOT NULL COMMENT '보드 종류 0이면 너반꿀, 1이면 자유게시판',
  `content` text NOT NULL COMMENT '내용',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `articleId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `articleId` (`articleId`),
  KEY `userId` (`userId`),
  CONSTRAINT `total_comment_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `totalboard` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `total_comment_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `total_comment`
--

LOCK TABLES `total_comment` WRITE;
/*!40000 ALTER TABLE `total_comment` DISABLE KEYS */;
INSERT INTO `total_comment` VALUES (1,1,'ab','2026-01-25 08:44:22','2026-01-25 08:44:22',NULL,1,1);
/*!40000 ALTER TABLE `total_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `total_dislike`
--

DROP TABLE IF EXISTS `total_dislike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `total_dislike` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `articleId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `articleId` (`articleId`),
  KEY `userId` (`userId`),
  CONSTRAINT `total_dislike_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `totalboard` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `total_dislike_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `total_dislike`
--

LOCK TABLES `total_dislike` WRITE;
/*!40000 ALTER TABLE `total_dislike` DISABLE KEYS */;
INSERT INTO `total_dislike` VALUES (1,'2026-01-25 08:44:15','2026-01-25 08:44:15',NULL,1,1);
/*!40000 ALTER TABLE `total_dislike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `total_like`
--

DROP TABLE IF EXISTS `total_like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `total_like` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `articleId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `articleId` (`articleId`),
  KEY `userId` (`userId`),
  CONSTRAINT `total_like_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `totalboard` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `total_like_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `total_like`
--

LOCK TABLES `total_like` WRITE;
/*!40000 ALTER TABLE `total_like` DISABLE KEYS */;
INSERT INTO `total_like` VALUES (1,'2026-01-25 08:44:14','2026-01-25 08:44:14','2026-01-25 08:44:14',1,1);
/*!40000 ALTER TABLE `total_like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `totalboard`
--

DROP TABLE IF EXISTS `totalboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `totalboard` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `board` int NOT NULL COMMENT '보드 종류 0이면 너반꿀, 1이면 자유게시판',
  `uuid` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '이미지 uuid',
  `thumbnail` varchar(256) DEFAULT '' COMMENT '썸네일 이미지 주소',
  `title` varchar(256) NOT NULL COMMENT '제목',
  `lossCut` bigint DEFAULT '0' COMMENT '손실액',
  `reflectLossCut` tinyint(1) DEFAULT '0' COMMENT '손실액이 User(totalLossCut)에 반영여부',
  `content` text NOT NULL COMMENT '내용',
  `count` int NOT NULL DEFAULT '0' COMMENT '조회수',
  `commentCount` int NOT NULL DEFAULT '0' COMMENT '댓글 갯수',
  `likeCount` int NOT NULL DEFAULT '0' COMMENT '좋아요 수',
  `dislikeCount` int NOT NULL DEFAULT '0' COMMENT '싫어요 수',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `totalboard_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `totalboard`
--

LOCK TABLES `totalboard` WRITE;
/*!40000 ALTER TABLE `totalboard` DISABLE KEYS */;
INSERT INTO `totalboard` VALUES (1,1,'69688c37-4782-433b-95e1-f71c9bfb924f','http://192.168.0.11:8128/images/69688c37-4782-433b-95e1-f71c9bfb924f/scaled_18.png','abc',234,1,'abcd',14,1,0,1,'2026-01-25 08:43:50','2026-01-26 13:52:49',NULL,1),(2,1,'e0771e81-98b9-4b9a-8c40-14506fed42a1','http://192.168.0.19:8128/images/e0771e81-98b9-4b9a-8c40-14506fed42a1/scaled_18.png','abc',234,0,'abcd',0,0,0,0,'2026-01-29 13:57:33','2026-01-29 13:57:33',NULL,1),(3,1,'97376e5d-2c83-49d7-b1f5-3ac9c5a1b184','http://192.168.0.19:8128/images/97376e5d-2c83-49d7-b1f5-3ac9c5a1b184/scaled_18.png','3',234234234,0,'sdfsdf',0,0,0,0,'2026-01-29 14:02:21','2026-01-29 14:02:21',NULL,1),(4,2,'d3ea1df1-119d-4092-b0c9-78523705e2ab','http://192.168.0.19:8128/images/d3ea1df1-119d-4092-b0c9-78523705e2ab/scaled_18.png','abc',234234,0,'abcd',0,0,0,0,'2026-01-29 14:08:12','2026-01-29 14:08:12',NULL,1),(5,2,'9e49dbb1-5ac1-4645-8cbb-cbbb0ad691e1','http://192.168.0.19:8128/images/9e49dbb1-5ac1-4645-8cbb-cbbb0ad691e1/scaled_18.png','sdlkjsdf',234,0,'sdfsdf',2,0,0,0,'2026-02-15 03:12:25','2026-02-20 12:59:59',NULL,2);
/*!40000 ALTER TABLE `totalboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `authority` int NOT NULL DEFAULT '0' COMMENT '권한 지금은 0(유저), 1(운영자)',
  `loginType` varchar(100) NOT NULL COMMENT 'login Type(kakao, google, email)',
  `key` varchar(100) NOT NULL COMMENT '이메일 또는 간편 로그인 토큰',
  `password` varchar(100) NOT NULL COMMENT '비밀번호',
  `badge` varchar(256) NOT NULL DEFAULT 'https://nurbanhoneyprofile3.s3.ap-northeast-2.amazonaws.com/badge/0.png' COMMENT '배지 이미지 주소(URL)',
  `nickname` varchar(100) NOT NULL COMMENT '닉네임',
  `description` text COMMENT '프로필 설명',
  `point` int NOT NULL DEFAULT '0' COMMENT '포인트 (글쓰기나 베팅을 통한 포인트 적립)',
  `bookmark` json DEFAULT NULL COMMENT '휘장(전체 소장한 휘장)',
  `totalLossCut` bigint DEFAULT '0' COMMENT '전체 손절액',
  `lastLoginAt` datetime NOT NULL COMMENT '라스트 로그인 시간',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,0,'kakao','K-2909272254','1111','http://192.168.0.19:8128/badge/0.png','너반꿀0','null',41,NULL,0,'2026-02-13 13:29:04','2026-01-24 05:39:37','2026-02-13 13:29:04',NULL),(2,0,'google','G-117433300193226601758','1111','http://192.168.0.21:8128/badge/0.png','너반꿀1','자기소개를 입a력하세a요.',10,NULL,0,'2026-02-20 13:03:48','2026-02-15 03:08:02','2026-02-20 13:03:48',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-15 19:34:55
