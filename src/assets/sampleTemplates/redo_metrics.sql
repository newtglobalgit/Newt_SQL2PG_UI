spool <<dmap_db_script_output_path>>
--spool C:\Users\dsure\Downloads\Final_new_scripts\redo_metrics.txt

/*
for sql query to work, 
the database should be in ARCHIVE mode
or
run in an NON-Data Guard database in archive mode 

Sql query will not work, 
if the database is in NOARCHIVE Mode 
(or)
running with a manual standby.
*/ 
set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 320
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
set heading off

prompt Script_Start - Rate of churn (data archiving) in the database over different hours. It calculates the total amount of space consumed by archived log files for each hour 

set heading off
/* rate of churn (data archiving) in the database over different hours. It calculates the total amount of space consumed by archived log files for each hour  */
--Script to pull the redo metrics from Oracle DB.
--The output of this script along with Init.ora file settings will help to size the db appropriately
col date_by_hour format a22
col CHURN_IN_MB format 999,999,999,999,990.00
SELECT
    subquery.date_by_hour||'NG_DMAP_DELIMITER'||subquery.CHURN_IN_MB||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM (
    SELECT
        TO_CHAR(TRUNC(first_time, 'HH24'), 'DD/MM/YYYY HH24:MI:SS') AS date_by_hour,
        SUM(ROUND(blocks*block_size/1024/1024)) AS CHURN_IN_MB
    FROM v$archived_log
    GROUP BY TRUNC(first_time, 'HH24')
) subquery
;
/
prompt
prompt Script_End - Rate of churn (data archiving) in the database over different hours. It calculates the total amount of space consumed by archived log files for each hour

spool off
quit;
/