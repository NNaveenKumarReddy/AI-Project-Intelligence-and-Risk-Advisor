import os
from typing import List, Dict, Any

class SampleDataGenerator:
    """
    Generates realistic, multi-format project artifacts:
    - SRS Proposal Document (.txt / .pdf equivalent)
    - Sprint 14 Meeting Notes (.docx equivalent)
    - Project Task Backlog (.csv)
    """
    
    @staticmethod
    def get_sample_files() -> List[Dict[str, Any]]:
        return [
            {
                "filename": "FinTech_Platform_SRS_v2.1.txt",
                "bytes": SampleDataGenerator._get_srs_content().encode("utf-8")
            },
            {
                "filename": "Sprint_14_Retrospective_Meeting_Notes.txt",
                "bytes": SampleDataGenerator._get_meeting_notes_content().encode("utf-8")
            },
            {
                "filename": "Project_Jira_Backlog_Export.csv",
                "bytes": SampleDataGenerator._get_csv_content().encode("utf-8")
            }
        ]

    @staticmethod
    def _get_srs_content() -> str:
        return """====================================================================
SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
PROJECT: Enterprise FinTech Mobile Banking Platform (v2.1)
====================================================================

1. PROJECT OVERVIEW & SCOPE
The objective of this project is to build an AI-powered Enterprise FinTech Mobile Banking Platform enabling real-time peer-to-peer transfers, automated risk compliance screening, and investment portfolio tracking.

2. CORE DELIVERABLES & MILESTONES
- Milestone 1: Core OAuth 2.0 & Biometric Authentication Module (Target: Week 4) - COMPLETED
- Milestone 2: Real-Time Payment Gateway & Stripe Integration (Target: Week 8) - AT RISK / DELAYED
- Milestone 3: AI Fraud Detection & Transaction Scoring Engine (Target: Week 12) - IN PROGRESS
- Milestone 4: Executive Portfolio Dashboard & Reporting Suite (Target: Week 16) - PENDING

3. SYSTEM ARCHITECTURE & INTEGRATION REQUIREMENTS
- The backend shall be deployed on Microservices Architecture using FastAPI and PostgreSQL.
- Third-party Payment Gateway APIs (Stripe, Plaid) must maintain 99.99% uptime SLA.
- All sensitive payload data must be encrypted using AES-256 at rest and TLS 1.3 in transit.

4. OUT OF SCOPE BOUNDARIES
- Direct physical ATM hardware integration is strictly out of scope for Release 1.0.
- Legacy mainframe COBOL database migration is postponed to Phase 2.

5. IDENTIFIED PROJECT RISKS
- Risk 01: Third-party Plaid API rate limits may throttle real-time account verification during peak hours.
- Risk 02: Potential 2-week schedule delay in Payment Gateway integration due to strict PCI-DSS compliance sign-off.
- Risk 03: Key-person dependency on Lead Security Engineer for OAuth token architecture.
"""

    @staticmethod
    def _get_meeting_notes_content() -> str:
        return """====================================================================
SPRINT 14 RETROSPECTIVE & PROJECT STATUS MEETING NOTES
Date: September 2, 2026
Attendees: Sarah Jenkins (PM), Alex Rivera (Tech Lead), David Chen (DevOps), Maria Garcia (QA)
====================================================================

1. SPRINT PROGRESS & DELIVERIES
- User Authentication module successfully passed QA regression testing.
- Database schema v1.4 migration completed, but DBA team flagged query latency on user transaction tables.

2. ACTIVE CRITICAL BLOCKERS
- BLOCKER #1: Awaiting external Payment Provider production API keys from Vendor Compliance Team. (Owner: Sarah Jenkins, Status: URGENT / OPEN)
- BLOCKER #2: Database index optimization for transaction logs pending approval from Chief Architect. (Owner: Alex Rivera, Status: IN PROGRESS)

3. DELIVERY FORECAST & DELAYS
- Tech Lead reported that payment processing milestone is currently running 1.5 weeks behind schedule due to vendor API specification changes.
- QA team requires 3 additional days for automated regression execution.

4. ACTION ITEMS
- ACTION 01: Sarah to escalate vendor API key request to VP of Engineering by Thursday.
- ACTION 02: Alex to optimize PostgreSQL index queries and run load tests.
- ACTION 03: David to configure staging environment SSL certificates and staging webhooks.
- ACTION 04: Maria to finalize test automation suites for payment refund workflows.
"""

    @staticmethod
    def _get_csv_content() -> str:
        return """Task_ID,Feature_Name,Assignee,Priority,Status,Story_Points,Risk_Flag
TASK-101,Setup OAuth2 Authentication Server,Alex Rivera,HIGH,Completed,8,No
TASK-102,Integrate Stripe Payment Gateway,Dev Team,CRITICAL,Blocked,13,Yes
TASK-103,Build AI Fraud Screening Endpoint,Machine Learning Lead,HIGH,In Progress,8,Yes
TASK-104,Implement Biometric Login for iOS/Android,Mobile Lead,MEDIUM,Completed,5,No
TASK-105,PostgreSQL Index Optimization,David Chen,HIGH,Open,5,Yes
TASK-106,PCI-DSS Compliance Audit Documentation,Security Lead,CRITICAL,In Progress,8,Yes
TASK-107,Design Executive Analytics Dashboard,UI Designer,MEDIUM,Open,3,No
TASK-108,End-to-End API Integration Testing,QA Lead,HIGH,Open,5,No
"""
