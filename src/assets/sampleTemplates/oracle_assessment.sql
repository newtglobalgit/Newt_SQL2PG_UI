spool <<dmap_db_script_output_path>>
--spool C:\Users\dsure\Downloads\Final_new_scripts\oracle_assessment.txt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 500
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col "Snapshot Interval" format 9999999999999990.00
col "Retention Interval" format 9999999999999990.00
set heading off
prompt Script_Start - Retrieve information about features in the Oracle Database that have been detected as used and display relevant details about their usages and versions. Used for licensing
set heading off
COLUMN u1.name  FORMAT a64
COLUMN u1.detected_usages FORMAT 999999999999990
COLUMN u1.currently_used for a5
COLUMN u1.version for a17
set heading off
SELECT parameter||'NG_DMAP_DELIMITER'||value||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM v$option
WHERE parameter in ('Real Application Clusters','Real Application Clusters One Node', 'Active Data Guard','Real Application Testing',
'Advanced Compression','Real Application Security','Advanced Security','Oracle Label Security','Oracle Database Vault','OLAP',
'Times Ten In-Memory Database','Database In-Memory','Tuning','Database Lifecycle Management Pack','Cloud Management Pack for Oracle Database','Diagnostics Pack','Partitioning')
Order by parameter;
prompt
prompt Script_End - Retrieve information about features in the Oracle Database that have been detected as used and display relevant details about their usages and versions. Used for licensing
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 500
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
set heading off
col "COUNT(*)" format 99990.00
set heading off

prompt Script_Start - number of instances in a RAC database
set heading off
SELECT COUNT(*)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
v$instance;
prompt
prompt Script_End - number of instances in a RAC database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 500
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col "COUNT(*)" format 99990.00
set heading off

prompt Script_Start - number of valid Data Guard destinations in the Oracle database
set heading off
SELECT COUNT(*)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
v$archive_dest
WHERE
status = 'VALID';
prompt
prompt Script_End - number of valid Data Guard destinations in the Oracle database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 9500
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off

prompt Script_Start - detailed information about database properties. The query returns results for all properties available in the DATABASE_PROPERTIES view

set heading off
column PROPERTY_VALUE format a128
column PROPERTY_NAME format a4000
column DESCRIPTION format a4000
column param format a50
SELECT NLS_DATE_LANGUAGE||'NG_DMAP_DELIMITER'||NLS_LANGUAGE||'NG_DMAP_DELIMITER'||NLS_TERRITORY||'NG_DMAP_DELIMITER'||NLS_CHARACTERSET||'NG_DMAP_DELIMITER'||NLS_CALENDAR||'NG_DMAP_DELIMITER'||DBTIMEZONE||'NG_DMAP_DELIMITER'||NLS_TIME_TZ_FORMAT||'NG_DMAP_DELIMITER'||NLS_DATE_FORMAT||'NG_DMAP_DELIMITER'||NLS_CURRENCY||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM (
    SELECT property_name, property_value
    FROM database_properties
    WHERE property_name IN (
        'NLS_DATE_LANGUAGE', 'NLS_LANGUAGE', 'NLS_TERRITORY', 
        'NLS_CHARACTERSET', 'NLS_CALENDAR', 'DBTIMEZONE','NLS_TIME_TZ_FORMAT','NLS_DATE_FORMAT',
        'NLS_CURRENCY'
    )
)
PIVOT (
    MAX(property_value)
    FOR property_name IN (
        'NLS_DATE_LANGUAGE' AS NLS_DATE_LANGUAGE,
        'NLS_LANGUAGE' AS NLS_LANGUAGE,
        'NLS_TERRITORY' AS NLS_TERRITORY,
        'NLS_CHARACTERSET' AS NLS_CHARACTERSET,
        'NLS_CALENDAR' AS NLS_CALENDAR,
        'DBTIMEZONE' AS DBTIMEZONE,
        'NLS_TIME_TZ_FORMAT' AS NLS_TIME_TZ_FORMAT,
        'NLS_DATE_FORMAT' AS NLS_DATE_FORMAT,
        'NLS_CURRENCY' AS NLS_CURRENCY
    )
);
prompt
prompt Script_End - detailed information about database properties. The query returns results for all properties available in the DATABASE_PROPERTIES view
prompt

set heading off
set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 32000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off

prompt Script_Start - Get current database time zone setting
set heading off
column PARAM format a50
SELECT DBTIMEZONE||'NG_DMAP_DELIMITER'||'NG_DMAP_END' FROM DUAL;
prompt
prompt Script_End - Get current database time zone setting
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 600
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off

prompt Script_Start - information about external tables in the Oracle database 
set heading off
column param format a50
column owner format a128
column table_name format a128
column default_directory_name format a128
select owner||'NG_DMAP_DELIMITER'||table_name||'NG_DMAP_DELIMITER'||default_directory_name||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from dba_external_tables;
prompt
prompt Script_End - information about external tables in the Oracle database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 300
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column param format a50
column profile format a30
column resource_name format a32
column resource_type format a8
column limit format a40
set heading off

prompt Script_Start - information about user profiles that have password verification functions enabled
set heading off
select a.profile||'NG_DMAP_DELIMITER'||a.resource_name||'NG_DMAP_DELIMITER'||a.resource_type||'NG_DMAP_DELIMITER'||a.limit||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from dba_profiles a 
where resource_name like 'PASSWORD_VERIFY%';
prompt Script_End - information about user profiles that have password verification functions enabled

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column param format a50
column bytes format 999999999990.00
set heading off
prompt Script_Start - total size of all segments in the Oracle database. include various types of segments such as tables, indexes, partitions, and more 
set heading off
select sum(bytes)/1024/1024/1024||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from dba_segments;
prompt
prompt Script_End - total size of all segments in the Oracle database. include various types of segments such as tables, indexes, partitions, and more
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column Param format a50
column bytes format 999999999990.00
set heading off

prompt Script_Start - total size of all data files in the Oracle database.Data files store the actual data and metadata of the database objects, such as tables and indexes 
set heading off
select sum(bytes)/1024/1024/1024||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from dba_data_files;
prompt
prompt Script_End - total size of all data files in the Oracle database.Data files store the actual data and metadata of the database objects, such as tables and indexes
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column param format a50
column bytes format 999999999990.00
set heading off

prompt Script_Start - total size of all temporary files in the Oracle database. Temporary files are used for temporary storage, such as sorting and grouping operations 
set heading off
select sum(bytes)/1024/1024/1024||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from dba_temp_files;
prompt
prompt Script_End - total size of all temporary files in the Oracle database. Temporary files are used for temporary storage, such as sorting and grouping operations
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column Param format a50
column type format 9999999999999990
column name format a80
column DISPLAY_VALUE format a255
set heading off

prompt Script_Start - information about specific initialization parameters from the V$PARAMETER view in an Oracle database
set heading off
SELECT
    subquery.memory_target||'NG_DMAP_DELIMITER'||subquery.memory_max_target||'NG_DMAP_DELIMITER'||subquery.undo_retention||'NG_DMAP_DELIMITER'||subquery.pga_aggregate_target||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
(
    SELECT
      MAX(CASE WHEN name = 'memory_max_target' THEN DISPLAY_VALUE END) AS memory_max_target,
      MAX(CASE WHEN name = 'memory_target' THEN DISPLAY_VALUE END) AS memory_target,
      MAX(CASE WHEN name = 'pga_aggregate_target' THEN DISPLAY_VALUE END) AS pga_aggregate_target,
      MAX(CASE WHEN name = 'undo_retention' THEN DISPLAY_VALUE END) AS undo_retention
    FROM v$parameter
    WHERE name IN ('memory_max_target', 'memory_target', 'pga_aggregate_target', 'undo_retention')
) subquery;
prompt
prompt Script_End - information about specific initialization parameters from the V$PARAMETER view in an Oracle database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
column Param format a50
column type format 9999999999999990
column name format a80
column force_logging format a39
column supplemental_log_data_fk format a3
column supplemental_log_data_all format a3
column supplemental_log_data_all format a8
column supplemental_log_data_pk format a3
column supplemental_log_data_ui format a3
set heading off

prompt Script_Start - information about logging and supplemental log data settings in the Oracle database.information about logging and supplemental log data settings in the Oracle database 
set heading off
SELECT force_logging||'NG_DMAP_DELIMITER'||supplemental_log_data_fk||'NG_DMAP_DELIMITER'||supplemental_log_data_all||'NG_DMAP_DELIMITER'||supplemental_log_data_min||'NG_DMAP_DELIMITER'||supplemental_log_data_pk||'NG_DMAP_DELIMITER'||supplemental_log_data_ui||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM v$database;
prompt
prompt Script_End - information about logging and supplemental log data settings in the Oracle database.information about logging and supplemental log data settings in the Oracle database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column Param format a50
column force_logging format a3
column tablespace_name format a30
set heading off

prompt Script_Start - information about logging settings at the tablespace level in the Oracle database
set heading off

SELECT tablespace_name||'NG_DMAP_DELIMITER'||force_logging||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
dba_tablespaces
ORDER BY 1;
prompt
prompt Script_End - information about logging settings at the tablespace level in the Oracle database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column Param format a50
column group# format 9999999999999990
column thread# format 9999999999999990
column bytes# format 9999999999999990.00
set heading off

prompt Script_Start - redo log sizes for each redo log group in the Oracle RAC database 
set heading off
SELECT
    subquery."1 (KB)"||'NG_DMAP_DELIMITER'||subquery."2 (KB)"||'NG_DMAP_DELIMITER'||subquery."3 (KB)"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM (
    SELECT
      MAX(CASE WHEN group# = 1 THEN bytes / 1024 END) AS "1 (KB)",
      MAX(CASE WHEN group# = 2 THEN bytes / 1024 END) AS "2 (KB)",
      MAX(CASE WHEN group# = 3 THEN bytes / 1024 END) AS "3 (KB)"
    FROM gv$log
) subquery;
prompt
prompt Script_End - redo log sizes for each redo log group in the Oracle RAC database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
set heading off
col MidN format 999
col 1AM format 999
col 2AM format 999
col 3AM format 999
col 4AM format 999
col 5AM format 999
col 6AM format 999
col 7AM format 999
col 8AM format 999
col 9AM format 999
col 10AM format 999
col 11AM format 999
col Noon format 999
col 1PM format 999
col 2PM format 999
col 3PM format 999
col 4PM format 999
col 5PM format 999
col 6PM format 999
col 7PM format 999
col 8PM format 999
col 9PM format 999
col 10PM format 999
col 11PM format 999

prompt Script_Start - aggregate and display the count of log switches that occurred during each hour of the day. It provides insights into the distribution of log switches over the course of a day
set heading off
SELECT
	subquery.logdate||'NG_DMAP_DELIMITER'||subquery."MidN"||'NG_DMAP_DELIMITER'||subquery."1AM"||'NG_DMAP_DELIMITER'||subquery."2AM"||'NG_DMAP_DELIMITER'||subquery."3AM"||'NG_DMAP_DELIMITER'||subquery."4AM"||'NG_DMAP_DELIMITER'||subquery."5AM"||'NG_DMAP_DELIMITER'||subquery."6AM"||'NG_DMAP_DELIMITER'||subquery."7AM"||'NG_DMAP_DELIMITER'||subquery."8AM"||'NG_DMAP_DELIMITER'||subquery."9AM"||'NG_DMAP_DELIMITER'||subquery."10AM"||'NG_DMAP_DELIMITER'||subquery."11AM"||'NG_DMAP_DELIMITER'||subquery."Noon"||'NG_DMAP_DELIMITER'||subquery."1PM"||'NG_DMAP_DELIMITER'||subquery."2PM"||'NG_DMAP_DELIMITER'||subquery."3PM"||'NG_DMAP_DELIMITER'||subquery."4PM"||'NG_DMAP_DELIMITER'||subquery."5PM"||'NG_DMAP_DELIMITER'||subquery."6PM"||'NG_DMAP_DELIMITER'||subquery."7PM"||'NG_DMAP_DELIMITER'||subquery."8PM"||'NG_DMAP_DELIMITER'||subquery."9PM"||'NG_DMAP_DELIMITER'||subquery."10PM"||'NG_DMAP_DELIMITER'||subquery."11PM"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM (
select to_char(first_time,'mm/dd/yy') logdate,
	sum(decode(to_char(first_time,'hh24'),'00',1,0)) "MidN",
	sum(decode(to_char(first_time,'hh24'),'01',1,0)) "1AM",
	sum(decode(to_char(first_time,'hh24'),'02',1,0)) "2AM",
	sum(decode(to_char(first_time,'hh24'),'03',1,0)) "3AM",
	sum(decode(to_char(first_time,'hh24'),'04',1,0)) "4AM",
	sum(decode(to_char(first_time,'hh24'),'05',1,0)) "5AM",
	sum(decode(to_char(first_time,'hh24'),'06',1,0)) "6AM",
	sum(decode(to_char(first_time,'hh24'),'07',1,0)) "7AM",
	sum(decode(to_char(first_time,'hh24'),'08',1,0)) "8AM",
	sum(decode(to_char(first_time,'hh24'),'09',1,0)) "9AM",
	sum(decode(to_char(first_time,'hh24'),'10',1,0)) "10AM",
	sum(decode(to_char(first_time,'hh24'),'11',1,0)) "11AM",
	sum(decode(to_char(first_time,'hh24'),'12',1,0)) "Noon",
	sum(decode(to_char(first_time,'hh24'),'13',1,0)) "1PM",
	sum(decode(to_char(first_time,'hh24'),'14',1,0)) "2PM",
	sum(decode(to_char(first_time,'hh24'),'15',1,0)) "3PM",
	sum(decode(to_char(first_time,'hh24'),'16',1,0)) "4PM",
	sum(decode(to_char(first_time,'hh24'),'17',1,0)) "5PM",
	sum(decode(to_char(first_time,'hh24'),'18',1,0)) "6PM",
	sum(decode(to_char(first_time,'hh24'),'19',1,0)) "7PM",
	sum(decode(to_char(first_time,'hh24'),'20',1,0)) "8PM",
	sum(decode(to_char(first_time,'hh24'),'21',1,0)) "9PM",
	sum(decode(to_char(first_time,'hh24'),'22',1,0)) "10PM",
	sum(decode(to_char(first_time,'hh24'),'23',1,0)) "11PM"
from v$log_history
group by to_char(first_time,'mm/dd/yy')
order by 1
) subquery;
/
prompt
prompt Script_End - aggregate and display the count of log switches that occurred during each hour of the day. It provides insights into the distribution of log switches over the course of a day
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
set heading off

prompt Script_Start - historical performance metric data for specific metrics over the last 7 days
set heading off
col INSTANCE_NUMBER format 999990.00
col METRIC_NAME format a64
col METRIC_UNIT format a64
col AVG_MINVAL format 990.00
col AVG_MAXVAL format 990.00
col AVG_AVGCAL format 990.00
set heading off
SELECT
	subquery.db_buffer_cache_hit_ratio_min_val||'NG_DMAP_DELIMITER'||subquery.db_buffer_cache_hit_ratio_max_val||'NG_DMAP_DELIMITER'||subquery.db_buffer_cache_hit_ratio_avg_val||'NG_DMAP_DELIMITER'||subquery.db_cursor_cache_hit_ratio_min_val||'NG_DMAP_DELIMITER'||subquery.db_cursor_cache_hit_ratio_max_val||'NG_DMAP_DELIMITER'||subquery.db_cursor_cache_hit_ratio_avg_val||'NG_DMAP_DELIMITER'||subquery.db_cpu_time_ratio_min_val||'NG_DMAP_DELIMITER'||subquery.db_cpu_time_ratio_max_val||'NG_DMAP_DELIMITER'||subquery.db_cpu_time_ratio_avg_val||'NG_DMAP_DELIMITER'||subquery.db_wait_time_ratio_min_val||'NG_DMAP_DELIMITER'||subquery.db_wait_time_ratio_max_val||'NG_DMAP_DELIMITER'||subquery.db_wait_time_ratio_avg_val||'NG_DMAP_DELIMITER'||subquery.db_exec_per_sec_min_val||'NG_DMAP_DELIMITER'||subquery.db_exec_per_sec_max_val||'NG_DMAP_DELIMITER'||subquery.db_exec_per_sec_avg_val||'NG_DMAP_DELIMITER'||subquery.db_exec_per_user_call_min_val||'NG_DMAP_DELIMITER'||subquery.db_exec_per_user_call_max_val||'NG_DMAP_DELIMITER'||subquery.db_exec_per_user_call_avg_val||'NG_DMAP_DELIMITER'||subquery.db_logon_per_sec_min_val||'NG_DMAP_DELIMITER'||subquery.db_logon_per_sec_max_val||'NG_DMAP_DELIMITER'||subquery.db_logon_per_sec_avg_val||'NG_DMAP_DELIMITER'||subquery.db_mem_sort_ratio_min_val||'NG_DMAP_DELIMITER'||subquery.db_mem_sort_ratio_max_val||'NG_DMAP_DELIMITER'||subquery.db_mem_sort_ratio_avg_val||'NG_DMAP_DELIMITER'||subquery.db_pga_cache_hit_min_val||'NG_DMAP_DELIMITER'||subquery.db_pga_cache_hit_max_val||'NG_DMAP_DELIMITER'||subquery.db_pga_cache_hit_avg_val||'NG_DMAP_DELIMITER'||subquery.db_phy_read_per_sec_min_val||'NG_DMAP_DELIMITER'||subquery.db_phy_read_per_sec_max_val||'NG_DMAP_DELIMITER'||subquery.db_phy_read_per_sec_avg_val||'NG_DMAP_DELIMITER'||subquery.db_phy_write_per_sec_min_val||'NG_DMAP_DELIMITER'||subquery.db_phy_write_per_sec_max_val||'NG_DMAP_DELIMITER'||subquery.db_phy_write_per_sec_avg_val||'NG_DMAP_DELIMITER'||subquery.db_redo_gen_per_sec_min_val||'NG_DMAP_DELIMITER'||subquery.db_redo_gen_per_sec_max_val||'NG_DMAP_DELIMITER'||subquery.db_redo_gen_per_sec_avg_val||'NG_DMAP_DELIMITER'||subquery.db_session_limit_percentage_min_val||'NG_DMAP_DELIMITER'||subquery.db_session_limit_percentage_max_val||'NG_DMAP_DELIMITER'||subquery.db_session_limit_percentage_avg_val||'NG_DMAP_DELIMITER'||subquery.db_shared_pool_free_percentage_min_val||'NG_DMAP_DELIMITER'||subquery.db_shared_pool_free_percentage_max_val||'NG_DMAP_DELIMITER'||subquery.db_shared_pool_free_percentage_avg_val||'NG_DMAP_DELIMITER'||subquery.db_soft_parse_ratio_min_val||'NG_DMAP_DELIMITER'||subquery.db_soft_parse_ratio_max_val||'NG_DMAP_DELIMITER'||subquery.db_soft_parse_ratio_avg_val||'NG_DMAP_DELIMITER'||subquery.db_user_call_per_sec_min_val||'NG_DMAP_DELIMITER'||subquery.db_user_call_per_sec_max_val||'NG_DMAP_DELIMITER'||subquery.db_user_call_per_sec_avg_val||'NG_DMAP_DELIMITER'||subquery.db_average_active_sessions_min_val||'NG_DMAP_DELIMITER'||subquery.db_average_active_sessions_max_val||'NG_DMAP_DELIMITER'||subquery.db_average_active_sessions_avg_val||'NG_DMAP_DELIMITER'||subquery.db_current_logons_count_min_val||'NG_DMAP_DELIMITER'||subquery.db_current_logons_count_max_val||'NG_DMAP_DELIMITER'||subquery.db_current_logons_count_avg_val||'NG_DMAP_DELIMITER'||subquery.db_session_count_min_val||'NG_DMAP_DELIMITER'||subquery.db_session_count_max_val||'NG_DMAP_DELIMITER'||subquery.db_session_count_avg_val||'NG_DMAP_DELIMITER'||subquery.db_total_pga_allocated_min_val||'NG_DMAP_DELIMITER'||subquery.db_total_pga_allocated_max_val||'NG_DMAP_DELIMITER'||subquery.db_total_pga_allocated_avg_val||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
(
    SELECT
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Buffer Cache Hit Ratio' THEN MINVAL END), 2) AS db_buffer_cache_hit_ratio_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Buffer Cache Hit Ratio' THEN MAXVAL END), 2) AS db_buffer_cache_hit_ratio_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Buffer Cache Hit Ratio' THEN AVERAGE END), 2) AS db_buffer_cache_hit_ratio_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Cursor Cache Hit Ratio' THEN MINVAL END), 2) AS db_cursor_cache_hit_ratio_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Cursor Cache Hit Ratio' THEN MAXVAL END), 2) AS db_cursor_cache_hit_ratio_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Cursor Cache Hit Ratio' THEN AVERAGE END), 2) AS db_cursor_cache_hit_ratio_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Database CPU Time Ratio' THEN MINVAL END), 2) AS db_cpu_time_ratio_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Database CPU Time Ratio' THEN MAXVAL END), 2) AS db_cpu_time_ratio_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Database CPU Time Ratio' THEN AVERAGE END), 2) AS db_cpu_time_ratio_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Database Wait Time Ratio' THEN MINVAL END), 2) AS db_wait_time_ratio_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Database Wait Time Ratio' THEN MAXVAL END), 2) AS db_wait_time_ratio_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Database Wait Time Ratio' THEN AVERAGE END), 2) AS db_wait_time_ratio_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Executions Per Sec' THEN MINVAL END), 2) AS db_exec_per_sec_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Executions Per Sec' THEN MAXVAL END), 2) AS db_exec_per_sec_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Executions Per Sec' THEN AVERAGE END), 2) AS db_exec_per_sec_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Executions Per User Call' THEN MINVAL END), 2) AS db_exec_per_user_call_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Executions Per User Call' THEN MAXVAL END), 2) AS db_exec_per_user_call_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Executions Per User Call' THEN AVERAGE END), 2) AS db_exec_per_user_call_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Logons Per Sec' THEN MINVAL END), 2) AS db_logon_per_sec_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Logons Per Sec' THEN MAXVAL END), 2) AS db_logon_per_sec_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Logons Per Sec' THEN AVERAGE END), 2) AS db_logon_per_sec_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Memory Sorts Ratio' THEN MINVAL END), 2) AS db_mem_sort_ratio_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Memory Sorts Ratio' THEN MAXVAL END), 2) AS db_mem_sort_ratio_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Memory Sorts Ratio' THEN AVERAGE END), 2) AS db_mem_sort_ratio_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'PGA Cache Hit %' THEN MINVAL END), 2) AS db_pga_cache_hit_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'PGA Cache Hit %' THEN MAXVAL END), 2) AS db_pga_cache_hit_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'PGA Cache Hit %' THEN AVERAGE END), 2) AS db_pga_cache_hit_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Physical Reads Per Sec' THEN MINVAL END), 2) AS db_phy_read_per_sec_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Physical Reads Per Sec' THEN MAXVAL END), 2) AS db_phy_read_per_sec_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Physical Reads Per Sec' THEN AVERAGE END), 2) AS db_phy_read_per_sec_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Physical Writes Per Sec' THEN MINVAL END), 2) AS db_phy_write_per_sec_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Physical Writes Per Sec' THEN MAXVAL END), 2) AS db_phy_write_per_sec_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Physical Writes Per Sec' THEN AVERAGE END), 2) AS db_phy_write_per_sec_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Redo Generated Per Sec' THEN MINVAL END), 2) AS db_redo_gen_per_sec_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Redo Generated Per Sec' THEN MAXVAL END), 2) AS db_redo_gen_per_sec_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Redo Generated Per Sec' THEN AVERAGE END), 2) AS db_redo_gen_per_sec_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Session Limit %' THEN MINVAL END), 2) AS db_session_limit_percentage_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Session Limit %' THEN MAXVAL END), 2) AS db_session_limit_percentage_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Session Limit %' THEN AVERAGE END), 2) AS db_session_limit_percentage_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Shared Pool Free %' THEN MINVAL END), 2) AS db_shared_pool_free_percentage_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Shared Pool Free %' THEN MAXVAL END), 2) AS db_shared_pool_free_percentage_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Shared Pool Free %' THEN AVERAGE END), 2) AS db_shared_pool_free_percentage_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Soft Parse Ratio' THEN MINVAL END), 2) AS db_soft_parse_ratio_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Soft Parse Ratio' THEN MAXVAL END), 2) AS db_soft_parse_ratio_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Soft Parse Ratio' THEN AVERAGE END), 2) AS db_soft_parse_ratio_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'User Calls Per Sec' THEN MINVAL END), 2) AS db_user_call_per_sec_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'User Calls Per Sec' THEN MAXVAL END), 2) AS db_user_call_per_sec_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'User Calls Per Sec' THEN AVERAGE END), 2) AS db_user_call_per_sec_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Average Active Sessions' THEN MINVAL END), 2) AS db_average_active_sessions_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Average Active Sessions' THEN MAXVAL END), 2) AS db_average_active_sessions_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Average Active Sessions' THEN AVERAGE END), 2) AS db_average_active_sessions_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Current Logons Count' THEN MINVAL END), 2) AS db_current_logons_count_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Current Logons Count' THEN MAXVAL END), 2) AS db_current_logons_count_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Current Logons Count' THEN AVERAGE END), 2) AS db_current_logons_count_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Session Count' THEN MINVAL END), 2) AS db_session_count_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Session Count' THEN MAXVAL END), 2) AS db_session_count_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Session Count' THEN AVERAGE END), 2) AS db_session_count_avg_val,
      
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Total PGA Allocated' THEN MINVAL END), 2) AS db_total_pga_allocated_min_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Total PGA Allocated' THEN MAXVAL END), 2) AS db_total_pga_allocated_max_val,
      ROUND(AVG(CASE WHEN METRIC_NAME = 'Total PGA Allocated' THEN AVERAGE END), 2) AS db_total_pga_allocated_avg_val
    FROM
      DBA_HIST_SNAPSHOT
      NATURAL JOIN DBA_HIST_SYSMETRIC_SUMMARY
    WHERE
      BEGIN_INTERVAL_TIME >= TRUNC(SYSDATE - 7)
      AND BEGIN_INTERVAL_TIME <= TRUNC(SYSDATE)
      AND METRIC_NAME IN (
        'Average Active Sessions',
        'Buffer Cache Hit Ratio',
        'Current Logons Count',
        'Logons Per Sec',
        'Cursor Cache Hit Ratio',
        'Database CPU Time Ratio',
        'Database Wait Time Ratio',
        'Memory Sorts Ratio',
        'PGA Cache Hit %',
        'Session Count',
        'Session Limit %',
        'Shared Pool Free %',
        'Soft Parse Ratio',
        'Total PGA Allocated',
        'User Calls Per Sec',
        'Executions Per User Call',
        'Executions Per Sec',
        'Physical Reads Per Sec',
        'Physical Writes Per Sec',
        'Redo Generated Per Sec'
      )
    GROUP BY
      INSTANCE_NUMBER,
      METRIC_NAME,
      METRIC_UNIT
    ORDER BY
      METRIC_NAME, INSTANCE_NUMBER
) subquery;
/
prompt
prompt Script_End - historical performance metric data for specific metrics over the last 7 days
prompt

set heading off
prompt Script_Start - summary of various performance metrics related to CDC (Change Data Capture) load and activity over the last 7 days
set heading off
set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
set heading off
col Param format a60
    COLUMN "EndTime" format 990.00
    COLUMN "Total Redo |(MB)" format 9999990.99
    COLUMN "Avg Redo |(KB/Txn)" format 999990.00
    COLUMN redo_iops  heading "Total REDO (IOPS)" format 999990.00
set heading off
COLUMN MAX(end_time) HEADING "EndTime"
COLUMN redo_mbytes HEADING "Total Redo |(MB)"
COLUMN redo_kbytes_per_txn HEADING "Avg Redo |(KB/Txn)"
COLUMN redo_iops  heading "Total REDO (IOPS)"
column BLK_CHANGES heading "Total Block |Changes"
column BLK_CHANGES_PER_TXN  heading "Avg Blk |Changes/TXN"
column MAX_BLK_CHANGES_per_TXN  heading "Max Blk |Changes/TXN"
column BLK_CHANGES_PER_CALL  heading "Avg Blk |Changes/Call"
column MAX_BLK_CHANGES_per_CALL  heading "Max Blk |Changes/Call"
column OS_LOAD   heading "Server Load"
column CPU_UTIL  heading "CPU Util"
column NETWORK_MBYTES_PER_SEC heading "Network |(MB/Sec)"
column BLK_CHANGES heading "Total Block |Changes"
column BLK_CHANGES_PER_TXN  heading "Avg Blk |Changes/TXN"
column MAX_BLK_CHANGES_per_TXN  heading "Max Blk |Changes/TXN"
column BLK_CHANGES_PER_CALL  heading "Avg Blk |Changes/Call"
column MAX_BLK_CHANGES_per_CALL  heading "Max Blk |Changes/Call"
column OS_LOAD   heading "Server Load"
column CPU_UTIL  heading "CPU Util"
column NETWORK_MBYTES_PER_SEC heading "Network |(MB/Sec)"
column Physical_Read_IOPS heading "Total Reads|(Thousands)"
column Physical_write_IOPS heading "Total Writes|(Thousands)"
set heading off
SELECT
subquery.max_end_time||'NG_DMAP_DELIMITER'||subquery.Redo_MBytes||'NG_DMAP_DELIMITER'||subquery.Redo_KBytes_per_TXN||'NG_DMAP_DELIMITER'||subquery.Physical_Read_IOPS||'NG_DMAP_DELIMITER'||subquery.Physical_write_IOPS||'NG_DMAP_DELIMITER'||subquery.BLK_CHANGES||'NG_DMAP_DELIMITER'||subquery.BLK_CHANGES_per_TXN||'NG_DMAP_DELIMITER'||subquery.MAX_BLK_CHANGES_per_TXN||'NG_DMAP_DELIMITER'||subquery.BLK_CHANGES_per_CALL||'NG_DMAP_DELIMITER'||subquery.MAX_BLK_CHANGES_per_CALL||'NG_DMAP_DELIMITER'||subquery.OS_LOad||'NG_DMAP_DELIMITER'||subquery.CPU_util||'NG_DMAP_DELIMITER'||subquery.Network_MBytes_per_sec||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
(
	select  
		max(end_time) max_end_time,
		round(sum(case metric_name when 'Redo Generated Per Sec' then average*(INTSIZE/100) end)/1024/1024) Redo_MBytes,
		round(avg(case metric_name when 'Redo Generated Per Txn' then average end)/1024) Redo_KBytes_per_TXN,
		round((sum(case metric_name when 'Physical Read Total IO Requests Per Sec' then average*(INTSIZE/100) end))/1000) Physical_Read_IOPS,
		round((sum(case metric_name when 'Physical Write Total IO Requests Per Sec' then average*(INTSIZE/100) end))/1000) Physical_write_IOPS,
		round(sum(case metric_name when 'DB Block Changes Per Sec' then average*(INTSIZE/100) end)/1024) BLK_CHANGES,
		round(avg(case metric_name when 'DB Block Changes Per Txn' then average end)/1024) BLK_CHANGES_per_TXN,
		round(max(case metric_name when 'DB Block Changes Per Txn' then MAXVAL end)) MAX_BLK_CHANGES_per_TXN,
		round(avg(case metric_name when 'DB Block Changes Per User Call' then average end)/1024) BLK_CHANGES_per_CALL,
		round(max(case metric_name when 'DB Block Changes Per User Call' then MAXVAL end)) MAX_BLK_CHANGES_per_CALL,
		round(avg(case metric_name when 'Current OS Load' then average end)) OS_LOad,
		round(avg(case metric_name when 'Host CPU Utilization (%)' then average end)) CPU_util, 
		round(avg(case metric_name when 'Network Traffic Volume Per Sec' then average end)/1024/1024) Network_MBytes_per_sec
	from dba_hist_sysmetric_summary
	where begin_time >= sysdate - 7
	group by snap_id
	order by snap_id
) subquery;
/
prompt
prompt Script_End - summary of various performance metrics related to CDC (Change Data Capture) load and activity over the last 7 days
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
col Param format a60
    COLUMN owner format a128
    COLUMN "SIZE IN GIGS" format 9999990.00
set heading off

prompt Script_Start - List of all schema and there size
set heading off
SELECT
	subquery.owner||'NG_DMAP_DELIMITER'||subquery."SIZE IN GIGS"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM (
	SELECT owner, round(SUM(bytes) / 1024 / 1024 / 1024) "SIZE IN GIGS"
		FROM
		dba_segments
		WHERE
		owner NOT IN (
		  'ANONYMOUS',
		  'APEX_030200',
		  'OLAPSYS',
		  'APEX_040200',
		  'APEX_PUBLIC_USER',
		  'APPQOSSYS',
		  'AUDSYS',
		  'BI',
		  'CTXSYS',
		  'DBSNMP',
		  'DIP',
		  'DVF',
		  'DVSYS',
		  'EXFSYS',
		  'FLOWS_FILES',
		  'GSMADMIN_INTERNAL',
		  'GSMCATUSER',
		  'GSMUSER',
		  'HR',
		  'IX',
		  'LBACSYS',
		  'MDDATA',
		  'MDSYS',
		  'OE',
		  'ORACLE_OCM',
		  'ORDDATA',
		  'ORDPLUGINS',
		  'ORDSYS',
		  'OUTLN','PM',
		  'SCOTT',
		  'SH',
		  'SI_INFORMTN_SCHEMA',
		  'SPATIAL_CSW_ADMIN_USR',
		  'SPATIAL_WFS_ADMIN_USR',
		  'SYS',
		  'SYSBACKUP',
		  'SYSDG',
		  'SYSKM',
		  'SYSTEM',
		  'WMSYS',
		  'XDB',
		  'SYSMAN',
		  'RMAN',
		  'RMAN_BACKUP',
		  'MT','OJVMSYS'
		)
		GROUP BY
		owner
		ORDER BY
		2 
) subquery;
/
prompt
prompt Script_End - List of all schema and there size
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column Param format a50
column end_interval_time format 990
column "Query Length in minutes" format 999999999990.00
set heading off

prompt Script_Start - information about long-running SQL queries from historical undo statistics in an Oracle database
set heading off
SELECT
subquery.end_interval_time||'NG_DMAP_DELIMITER'||subquery."Query Length in minutes"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM 
(
	SELECT
	end_interval_time,
	MAX(round(maxquerylen / 60)) "Query Length in minutes"
	FROM
	dba_hist_undostat
	NATURAL JOIN dba_hist_snapshot
	WHERE
	end_interval_time > SYSDATE - 3
	GROUP BY
	end_interval_time
) subquery;
prompt
prompt Script_End - information about long-running SQL queries from historical undo statistics in an Oracle database
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 300
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off

column param format a50
column profile format a30
column resource_name format a32
column resource_type format a8
column limit format a40

ALTER SESSION SET nls_date_format = 'DD-MM-YYYY HH24:MI:SS' ;
set heading off
prompt Script_Start - information about the oldest transaction with a block change, including the start time, current time, and duration of the transaction
set heading off
SELECT
subquery."Current Time"||'NG_DMAP_DELIMITER'||subquery."Oldest Transaction Start time"||'NG_DMAP_DELIMITER'||subquery."Transaction duration"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
(
    SELECT
     SYSDATE "Current Time",
     MIN(TO_DATE(start_time, 'MM/DD/YY HH24:MI:SS')) "Oldest Transaction Start time",
     ( SYSDATE - MIN(TO_DATE(start_time, 'MM/DD/YY HH24:MI:SS')) ) "Transaction duration"
     FROM
     v$transaction
     WHERE
     cr_change > 0
) subquery;
prompt
prompt Script_End - information about the oldest transaction with a block change, including the start time, current time, and duration of the transaction
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 300
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column param format a50
column event format a64
column cnt format 9990.00
compute sum of cnt on report
compute sum of "%age of wait" on report
break on report
set heading off

prompt Script_Start - report showing the percentage of wait time for different database events. The query calculates the percentage of wait time for each event and orders the results based on the total wait count

set heading off
SELECT
	subquery.event||'NG_DMAP_DELIMITER'||subquery.cnt||'NG_DMAP_DELIMITER'||subquery."%age of wait"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
(
	select event,  cnt,
	(ratio_to_report(cnt) over ())*100 "%age of wait" from (
	select event, sum(cnt) cnt from (
	select case when event='latch free' and p2=(select latch# from v$latch where name='library cache') then event||'. Library Cache' else  event end event, 1 cnt
	from v$session_wait
	where event not like '%messag%')
	group by event
	order by 2)
) subquery;
prompt
prompt Script_End - report showing the percentage of wait time for different database events. The query calculates the percentage of wait time for each event and orders the results based on the total wait count
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 300
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
set heading off
column Param format a50
column profile format a30
column resource_name format a32
column resource_type format a8
column limit format a40
set heading off

prompt Script_Start - information about hidden parameters in an Oracle database. This query can be useful for retrieving information about advanced database configuration
set heading off
select name||'NG_DMAP_DELIMITER'||value||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
from v$parameter 
where name like '\_%' escape '\';
/
prompt
prompt Script_End - information about hidden parameters in an Oracle database. This query can be useful for retrieving information about advanced database configuration
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 100
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col "Snapshot Interval" format 9999999999999990.00
col "Retention Interval" format 9999999999999990.00
set heading off

prompt Script_Start - Get snapshot and retention interval in minutes from dba_hist_wr_control
select
	subquery."Snapshot Interval"||'NG_DMAP_DELIMITER'||subquery."Retention Interval"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM 
(
	select
	extract( day from snap_interval) *24*60+
	extract( hour from snap_interval) *60+
	extract( minute from snap_interval ) "Snapshot Interval",
	extract( day from retention) *24*60+
	extract( hour from retention) *60+
	extract( minute from retention ) "Retention Interval"
	from dba_hist_wr_control
) subquery;
prompt
prompt Script_End - Get snapshot and retention interval in minutes from dba_hist_wr_control
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 100
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col retention format 9999999999999990.00
set heading off

prompt Script_Start - Get absolute value of retention from dba_hist_wr_control
set heading off
SELECT retention||'NG_DMAP_DELIMITER'||'NG_DMAP_END' FROM dba_hist_wr_control;
prompt
prompt Script_End - Get absolute value of retention from dba_hist_wr_control
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5260
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
col h.sample_time format 990
col u.username format a128
col h.program format a64
col h.module format a64
col s.sql_text format a5000 

set heading off

prompt Script_Start - Get all the queries executed in last 30 days
set heading off
SELECT h.sample_time||'NG_DMAP_DELIMITER'||u.username||'NG_DMAP_DELIMITER'||h.program||'NG_DMAP_DELIMITER'||h.module||'NG_DMAP_DELIMITER'||s.sql_text||'NG_DMAP_DELIMITER'||'NG_DMAP_END' 
FROM DBA_HIST_ACTIVE_SESS_HISTORY h, DBA_USERS u, DBA_HIST_SQLTEXT s 
WHERE sample_time >= SYSDATE - 30
AND h.user_id=u.user_id 
AND h.sql_id = s.sql_iD 
ORDER BY h.sample_time;
prompt
prompt Script_End - Get all the queries executed in last 30 days
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 9000
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col host_name for a64 
set heading off

prompt Script_Start Get Host Name
set heading off
select host_name||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from v$instance;
prompt
prompt Script_End Get Host Name
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 210
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
set heading off

prompt Script_Start - Get Oracle Version
set heading off
SET LINESIZE 900
col Oracle_Version for a15
col Banner_full  for a160
SELECT Banner_full||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
v$version;
/
prompt
prompt Script_End - Get Oracle Version
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 70
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off

col OS_Version for a50
set heading off

prompt Script_Start - Get OS version
set heading off
SELECT dbms_utility.port_string||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
dual;
/
prompt
prompt Script_End - Get OS version
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 200
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col cpu.value for 99999999990
col cpu.value for 9999990
col socket.value for 9999990
col ram.value for 9999990.00
set heading off

prompt Script_Start - Get CPU Details
set heading off
select cpu.value||'NG_DMAP_DELIMITER'||core.value||'NG_DMAP_DELIMITER'||socket.value ||'NG_DMAP_DELIMITER'||ram.value||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from (select to_char(VALUE) value
from v$osstat
where stat_name = 'NUM_CPUS') cpu
, (select sum(value) value
from v$osstat
where stat_name = 'NUM_CPU_CORES') core
, (select sum(value) value
from v$osstat where stat_name='NUM_CPU_SOCKETS') socket
,(select round(VALUE/1024/1024/1024,0) value
from v$osstat where stat_name='PHYSICAL_MEMORY_BYTES') ram
;
prompt
prompt Script_End - Get CPU Details
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 200
set longchunksize 500000
set long 500000
set pagesize 9500
set wrap on
set feedback off
col SGA_Details for a10
col used.bytes for 9999999999990.00
col free.bytes for 9999999999990.00
col tot.bytes for 9999999999990.00
set heading off

prompt Script_Start - SGA Used, SGA Free, SGA Total
set heading off
select round(used.bytes /1024/1024 ,2)||'NG_DMAP_DELIMITER'||round(free.bytes /1024/1024 ,2)||'NG_DMAP_DELIMITER'||round(tot.bytes /1024/1024 ,2)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
from (select sum(bytes) bytes
from v$sgastat
where name != 'free memory') used
, (select sum(bytes) bytes
from v$sgastat
where name = 'free memory') free
, (select sum(bytes) bytes
from v$sgastat) tot;
/
prompt 
prompt Script_End - SGA Used, SGA Free, SGA Total
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 200
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col PGA_Details for a10
col used.bytes for 9999999999990.00
col free.bytes for 9999999999990.00
col tot.bytes for 9999999999990.00
set heading off
prompt Script_Start - PGA Used, PGA Free, PGA Total
set heading off
select round(used.bytes /1024/1024 ,2)||'NG_DMAP_DELIMITER'||round(free.bytes /1024/1024 ,2)||'NG_DMAP_DELIMITER'||round(tot.bytes /1024/1024 ,2)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
from (select sum(value) bytes
from v$pgastat
where name = 'total PGA inuse') used
, (select sum(value) bytes
from v$pgastat
where name = 'total freeable PGA memory') free
, (select sum(value) bytes
from v$pgastat where name='total PGA allocated') tot 
;
prompt
prompt Script_End - PGA Used, PGA Free, PGA Total
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 200
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col owner for a30
col object_type for a30
col status for a20
col count(*) for 9999999999990

set heading off
prompt Script_Start - All object type and its count
set heading off
SELECT owner||'NG_DMAP_DELIMITER'||object_type||'NG_DMAP_DELIMITER'||status||'NG_DMAP_DELIMITER'||COUNT(*)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
dba_objects
WHERE
owner NOT IN (
'ANONYMOUS',
'APEX_030200',
'OLAPSYS',
'APEX_040200',
'APEX_PUBLIC_USER',
'APPQOSSYS',
'AUDSYS',
'BI',
'CTXSYS',
'DBSNMP',
'DIP',
'DVF',
'DVSYS',
'EXFSYS',
'FLOWS_FILES',
'GSMADMIN_INTERNAL',
'GSMCATUSER',
'GSMUSER',
'HR',
'IX',
'LBACSYS',
'MDDATA',
'MDSYS',
'OE',
'ORACLE_OCM',
'ORDDATA',
'ORDPLUGINS',
'ORDSYS',
'OUTLN',
'PM',
'SCOTT',
'SH',
'SI_INFORMTN_SCHEMA',
'SPATIAL_CSW_ADMIN_USR',
'SPATIAL_WFS_ADMIN_USR',
'SYS',
'SYSBACKUP',
'SYSDG',
'SYSKM',
'SYSTEM',
'WMSYS',
'XDB',
'SYSMAN',
'RMAN',
'RMAN_BACKUP',
'MT','OJVMSYS'
)
GROUP BY owner, object_type, status;
prompt
prompt Script_End - All object type and its count
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 300
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
col owner for a30
col data_type for a128
col count(*) for 9999999999990
set heading off

Prompt Script_Start - All column, binary and long raw column count for all tables
set heading off
SELECT q.owner||'NG_DMAP_DELIMITER'||q.object_name||'NG_DMAP_DELIMITER'||total_columns||'NG_DMAP_DELIMITER'||binary_columns||'NG_DMAP_DELIMITER'||long_row||'NG_DMAP_DELIMITER'||'NG_DMAP_END' FROM
(SELECT t.owner,t.object_name, COUNT(c.column_name) AS total_columns,
SUM(CASE WHEN c.data_type IN ('RAW', 'BLOB', 'CLOB', 'BFILE', 'LONG RAW', 'LONG', 'NCLOB') THEN 1 ELSE 0 END) AS binary_columns,
SUM(CASE WHEN c.data_type ='LONG RAW' THEN 1 ELSE 0 END) AS long_row
FROM dba_objects t
JOIN dba_tab_columns c ON t.owner = c.owner AND t.object_name = c.table_name
WHERE t.object_type = 'TABLE' and 
t.owner NOT IN ('ANONYMOUS','APEX_030200','OLAPSYS','APEX_040200','APEX_PUBLIC_USER','APPQOSSYS','AUDSYS','BI','CTXSYS','DBSNMP','DIP',
'DVF','DVSYS','EXFSYS','FLOWS_FILES','GSMADMIN_INTERNAL','GSMCATUSER','GSMUSER','HR','IX','LBACSYS','MDDATA','MDSYS','OE','ORACLE_OCM',
'ORDDATA','ORDPLUGINS','ORDSYS','OUTLN','PM','SCOTT','SH','SI_INFORMTN_SCHEMA','SPATIAL_CSW_ADMIN_USR','SPATIAL_WFS_ADMIN_USR','SYS',
'SYSBACKUP','SYSDG','SYSKM','SYSTEM','WMSYS','XDB','SYSMAN','RMAN','RMAN_BACKUP','MT','OJVMSYS')
GROUP BY
    t.owner,t.object_name
ORDER BY
    t.owner, t.object_name) q;

prompt
Prompt Script_End - All column, binary and long raw column count for all tables
prompt

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
col OWNER for a128
col TABLE_NAME for a128
col COLUMN_NAME for a128
col ENCRTPYION_ALG for a29
set heading off

prompt Script_Start - Find encrypted table columns details
set heading off
SELECT OWNER||'NG_DMAP_DELIMITER'||TABLE_NAME||'NG_DMAP_DELIMITER'||COLUMN_NAME||'NG_DMAP_DELIMITER'||ENCRYPTION_ALG||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM DBA_ENCRYPTED_COLUMNS;
prompt
prompt Script_End - Find encrypted table columns details
prompt

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
col OWNER for a128
col NAME for a128
col TYPE for a12
set heading off

prompt Script_Start - List of all encrypted objects with its schema and object type
set heading off
SELECT DISTINCT OWNER||'NG_DMAP_DELIMITER'||NAME||'NG_DMAP_DELIMITER'||TYPE||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
  FROM DBA_SOURCE
 WHERE UPPER (TEXT) LIKE '%DBMS_CRYPTO%' AND OWNER NOT IN
 (
    'ANONYMOUS',
    'APEX_030200',
    'OLAPSYS',
    'APEX_040200',
    'APEX_PUBLIC_USER',
    'APPQOSSYS',
    'AUDSYS',
    'BI',
    'CTXSYS',
    'DBSNMP',
    'DIP',
    'DVF',
    'DVSYS',
    'EXFSYS',
    'FLOWS_FILES',
    'GSMADMIN_INTERNAL',
    'GSMCATUSER',
    'GSMUSER',
    'HR',
    'IX',
    'LBACSYS',
    'MDDATA',
    'MDSYS',
    'OE',
    'ORACLE_OCM',
    'ORDDATA',
    'ORDPLUGINS',
    'ORDSYS',
    'OUTLN',
    'PM',
    'SCOTT',
    'SH',
    'SI_INFORMTN_SCHEMA',
    'SPATIAL_CSW_ADMIN_USR',
    'SPATIAL_WFS_ADMIN_USR',
    'SYS',
    'SYSBACKUP',
    'SYSDG',
    'SYSKM',
    'SYSTEM',
    'WMSYS',
    'XDB',
    'SYSMAN',
    'RMAN',
    'RMAN_BACKUP',
    'MT','OJVMSYS'
    )
;
prompt
prompt Script_End - List of all encrypted objects with its schema and object type
prompt

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
col OWNER for  a128 
col SEGMENT_NAME for  a128
col SEGMENT_TYPE for  a18
col TopObjectsbySize_in_GB for  9999999999990.00
set heading off

prompt Script_Start - Top Objects by Size
set heading off

SELECT a.owner||'NG_DMAP_DELIMITER'||a.segment_name||'NG_DMAP_DELIMITER'||a.segment_type||'NG_DMAP_DELIMITER'||a.TopObjectsbySize_in_GB||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
 FROM ( SELECT owner, segment_name, segment_type, round((SUM(bytes)) / 1024 / 1024 / 1024, 4) as TopObjectsbySize_in_GB
FROM dba_segments WHERE segment_type != 'INDEX'
AND owner NOT IN 
('ANONYMOUS','APEX_030200','OLAPSYS','APEX_040200','APEX_PUBLIC_USER','APPQOSSYS','AUDSYS','BI','CTXSYS','DBSNMP','DIP','DVF','DVSYS','EXFSYS', 'FLOWS_FILES','GSMADMIN_INTERNAL','GSMCATUSER','GSMUSER','HR','IX','LBACSYS','MDDATA','MDSYS','OE','ORACLE_OCM','ORDDATA','ORDPLUGINS','ORDSYS','OUTLN','PM','SCOTT', 'SH','SI_INFORMTN_SCHEMA','SPATIAL_CSW_ADMIN_USR','SPATIAL_WFS_ADMIN_USR','SYS','SYSBACKUP','SYSDG','SYSKM','SYSTEM','WMSYS','XDB','SYSMAN','RMAN','RMAN_BACKUP','MT','OJVMSYS','OJVMSYS')
GROUP BY owner,segment_name,segment_type 
ORDER BY 4 DESC) a WHERE TopObjectsbySize_in_GB <>0 
;
prompt
prompt Script_End - Top Objects by Size
prompt

set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5260
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col Table_with_LOBs format a16
col a.owner format a128
col a.table_name format a128
col a.data_type format a128
col a.column_name format a128
col bytes format 999999999999990.00
col "Size MB" format 999999999999990.00
set heading off

prompt Script_Start - List of all LOB type columns, with its table, data type and size. Order by size - size is in MB 
set heading off
SELECT
    a.owner||'NG_DMAP_DELIMITER'||a.table_name||'NG_DMAP_DELIMITER'||a.column_name||'NG_DMAP_DELIMITER'||a.data_type||'NG_DMAP_DELIMITER'||bytes /(1024 / 1024)||'NG_DMAP_DELIMITER'||'NG_DMAP_END' 
FROM dba_tab_columns   a,
    dba_segments      b
    WHERE
    a.owner = b.owner
    AND a.table_name = b.segment_name
    AND a.data_type IN (
    'CLOB',
    'BLOB',
    'NCLOB'
    )
    AND a.owner NOT IN (
    'ANONYMOUS',
    'APEX_030200',
    'OLAPSYS',
    'APEX_040200',
    'APEX_PUBLIC_USER',
    'APPQOSSYS',
    'AUDSYS',
    'BI',
    'CTXSYS',
    'DBSNMP',
    'DIP',
    'DVF',
    'DVSYS',
    'EXFSYS',
    'FLOWS_FILES',
    'GSMADMIN_INTERNAL',
    'GSMCATUSER',
    'GSMUSER',
    'HR',
    'IX',
    'LBACSYS',
    'MDDATA',
    'MDSYS',
    'OE',
    'ORACLE_OCM',
    'ORDDATA',
    'ORDPLUGINS',
    'ORDSYS',
    'OUTLN',
    'PM',
    'SCOTT',
    'SH',
    'SI_INFORMTN_SCHEMA',
    'SPATIAL_CSW_ADMIN_USR',
    'SPATIAL_WFS_ADMIN_USR',
    'SYS',
    'SYSBACKUP',
    'SYSDG',
    'SYSKM',
    'SYSTEM',
    'WMSYS',
    'XDB',
    'SYSMAN',
    'RMAN',
    'RMAN_BACKUP'
    )
    ORDER BY
     bytes/(1024/1024) DESC
;
prompt
prompt Script_End - List of all LOB type columns, with its table, data type and size. Order by size - size is in MB
prompt

prompt Script_Start - Actual size , allocated size and percentage used by LOB for all schemas
SELECT
	subquery.owner||'NG_DMAP_DELIMITER'||subquery.actual_size_mb||'NG_DMAP_DELIMITER'||subquery.total_size_mb||'NG_DMAP_DELIMITER'||subquery.percentage_used_size||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM 
(
	select owner,sum(actual_size_mb) actual_size_mb, sum(total_size_mb) total_size_mb,
	sum(round((actual_size_mb/ total_size_mb)*100 , 10)) ||'%' percentage_used_size
	from
	(select owner,
	   table_name,
	   column_name,
	   segment_name,
	   a.bytes/1024/1024 actual_size_mb,
	   a.blocks,    (a.bytes/a.blocks)/1024 block_size_kb,
	   a.max_size,
	   (( a.bytes/a.blocks)* a.max_size)/1024/1024 total_size_mb
	 from
	   dba_segments a
	join
	   dba_lobs b
	using (owner, segment_name) where 
	owner not in ('SYS','SYSTEM','OUTLN','DBSNMP','OUTLN','ORACLE','PERFSTAT','OPS$ORACLE','XDB','WMSYS','MDSYS','AUDSYS'))
	group by owner
	order by percentage_used_size desc
) subquery;
/
prompt
prompt Script_End - Actual size , allocated size and percentage used by LOB for all schemas
prompt

prompt Script_Start - Space utilization metrics for LOB (Large Object) segments across all owners (database users), excluding system users
SELECT
	subquery.actual_size_mb||'NG_DMAP_DELIMITER'||subquery.total_size_mb||'NG_DMAP_DELIMITER'||subquery.percentage_used_size||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM 
(
	select sum(actual_size_mb) actual_size_mb, sum(total_size_mb) total_size_mb,
	sum(round((actual_size_mb/ total_size_mb)*100 , 10)) ||'%' percentage_used_size
	from
	(select owner,
	   table_name,
	   column_name,
	   segment_name,
	   a.bytes/1024/1024 actual_size_mb,
	   a.blocks,    (a.bytes/a.blocks)/1024 block_size_kb,
	   a.max_size,
	   (( a.bytes/a.blocks)* a.max_size)/1024/1024 total_size_mb
	 from
	   dba_segments a
	join
	   dba_lobs b
	using (owner, segment_name) where 
	owner not in ('SYS','SYSTEM','OUTLN','DBSNMP','OUTLN','ORACLE','PERFSTAT','OPS$ORACLE','XDB','WMSYS','MDSYS','AUDSYS'))
	order by percentage_used_size desc
) subquery;
/
prompt
prompt Script_End - Space utilization metrics for LOB (Large Object) segments across all owners (database users), excluding system users
prompt

prompt Script_Start - Table rows count
prompt

SELECT owner||'NG_DMAP_DELIMITER'||table_name||'NG_DMAP_DELIMITER'||num_rows||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM dba_tables 
Where num_rows is not NULL 
AND num_rows > 0
AND owner NOT IN ('ANONYMOUS','APEX_030200','OLAPSYS','APEX_040200','APEX_PUBLIC_USER','APPQOSSYS','AUDSYS','BI','CTXSYS','DBSNMP','DIP','DVF','DVSYS','EXFSYS',
'FLOWS_FILES','GSMADMIN_INTERNAL','GSMCATUSER','GSMUSER','HR','IX','LBACSYS','MDDATA','MDSYS','OE','ORACLE_OCM','ORDDATA','ORDPLUGINS','ORDSYS','OUTLN','PM','SCOTT',
'SH','SI_INFORMTN_SCHEMA','SPATIAL_CSW_ADMIN_USR','SPATIAL_WFS_ADMIN_USR','SYS','SYSBACKUP','SYSDG','SYSKM','SYSTEM','WMSYS','XDB','SYSMAN','RMAN','RMAN_BACKUP','MT','OJVMSYS','OJVMSYS')
order by num_rows desc;

prompt
prompt Script_End - Table rows count
prompt

spool off
quit;
/