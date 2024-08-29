spool <<dmap_db_script_output_path>>
--spool C:\Users\dsure\Downloads\Final_new_scripts\oracle_assessment.txt

prompt

prompt Script_Start - Number of partition, sub partition, partition type, sub partition type for all tables in all schemas
set heading off
col owner  for  a30
col table_name for  a30
col SUBPARTITIONING_TYPE  for  a12
col SUBPARTITIONING_COUNT  for  9999999999999
col TEXT  for  a4000
set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 5000
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
/* Number of partition, sub partition, partition type, sub partition type for all tables in all schemas */
SELECT  P.owner||'NG_DMAP_DELIMITER'||P.table_name||'NG_DMAP_DELIMITER'||NVL (P.PARTITIONING_TYPE, 'NA')||'NG_DMAP_DELIMITER'||NVL (P.PARTITION_COUNT, 0)||'NG_DMAP_DELIMITER'||NVL (P.SUBPARTITIONING_TYPE, 'NA')||'NG_DMAP_DELIMITER'||NVL (P.SUBPARTITION_COUNT, 0)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM 
        (  SELECT  a.owner,
                           a.table_name,
                           a.partitioning_type,
                             case when a.subpartitioning_type = 'NONE' then 'NA' else a.subpartitioning_type end as subpartitioning_type,
                           COUNT (b.PARTITION_NAME)     PARTITION_COUNT,
                            sum (b.SUBPARTITION_COUNT)     SUBPARTITION_COUNT                       
             FROM DBA_PART_TABLES A, DBA_TAB_PARTITIONS B
            WHERE     A.OWNER = B.TABLE_OWNER
                  AND A.TABLE_NAME = B.TABLE_NAME
                  AND a.owner NOT IN ('SYS',
                                      'SYSTEM',
                                      'OUTLN',
                                      'DBSNMP',
                                      'OUTLN',
                                      'ORACLE',
                                      'PERFSTAT',
                                      'OPS$ORACLE',
                                      'AUDSYS',
                                      'MDSYS')
         GROUP BY a.owner, a.table_name, a.partitioning_type, a.subpartitioning_type)
         P
/
set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 15000
set longchunksize 200000
set long 200000
set pagesize 32000
set wrap on
set feedback off
REM set newpage none
col owner  for  a128
col table_name for  a128
col partition_name  for  a128
col size_mb for  99999999990.00
set heading off
prompt
prompt Script_End - Number of partition, sub partition, partition type, sub partition type for all tables in all schemas
prompt

prompt Script_Start - List of partition in order of there size with table and schema name
set heading off
select owner||'NG_DMAP_DELIMITER'||table_name||'NG_DMAP_DELIMITER'||max(partition_name)||'NG_DMAP_DELIMITER'||max(size_mb)||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from (
SELECT P.TABLE_OWNER OWNER, P.TABLE_NAME TABLE_NAME, S.partition_name PARTITION_NAME, bytes/1024/1024 SIZE_MB 
FROM dba_segments S, DBA_TAB_PARTITIONS P 
WHERE P.PARTITION_NAME = S.PARTITION_NAME AND S.OWNER = P.TABLE_OWNER 
AND S.segment_type = 'TABLE PARTITION'
 AND S.OWNER not in ('SYS','SYSTEM','OUTLN','DBSNMP','OUTLN','ORACLE','PERFSTAT','OPS$ORACLE', 'AUDSYS','MDSYS')
 and 1=2
order by size_mb desc) 
group by owner , table_name
/
prompt
prompt Script_End - List of partition in order of there size with table and schema name


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
where first_time > (sysdate-7) and 1=2
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
     cr_change > 0 and 1=2
	 and TO_DATE(start_time, 'MM/DD/YY HH24:MI:SS') > (sysdate-7)
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
	where event not like '%messag%' and 1=2)
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
WHERE 1=2 and
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
begin
dbms_metadata.set_transform_param (dbms_metadata.session_transform,'STORAGE',false);
dbms_metadata.set_transform_param (dbms_metadata.session_transform,'SEGMENT_ATTRIBUTES', false);
dbms_metadata.set_transform_param (dbms_metadata.session_transform,'TABLESPACE',false);
dbms_metadata.set_transform_param (dbms_metadata.session_transform,'REF_CONSTRAINTS', true);
dbms_metadata.set_transform_param (dbms_metadata.session_transform,'CONSTRAINTS', true);
dbms_metadata.set_transform_param (dbms_metadata.session_transform,'PRETTY',true);
dbms_metadata.set_transform_param(dbms_metadata.session_transform,'SQLTERMINATOR',true);
dbms_metadata.set_transform_param(dbms_metadata.session_transform,'PARTITIONING',false);
end;
/
prompt Script_Start - Top Objects by Size
set heading off
with table_size as
	(
	SELECT
		owner,
		segment_name,
		segment_type,
		topobjectsbysize_in_gb
	FROM
		(
			SELECT
				owner,
				object_name as segment_name,
				object_type as segment_type,
				round((SUM(bytes)) / 1024 / 1024 / 1024,
					  1) AS topobjectsbysize_in_gb
			FROM
				(
					SELECT
						owner,
						segment_name AS object_name,
						'TABLE'      AS object_type,
						segment_name AS table_name,
						bytes,
						tablespace_name,
						extents,
						initial_extent
					FROM
						dba_segments
					WHERE
						segment_type IN ( 'TABLE', 'TABLE PARTITION', 'TABLE SUBPARTITION' )
					AND owner NOT IN ( 'ANONYMOUS', 'APEX_030200', 'OLAPSYS', 'APEX_040200', 'APEX_PUBLIC_USER',
								   'APPQOSSYS', 'AUDSYS', 'BI', 'CTXSYS', 'DBSNMP',
								   'DIP', 'DVF', 'DVSYS', 'EXFSYS', 'FLOWS_FILES',
								   'GSMADMIN_INTERNAL', 'GSMCATUSER', 'GSMUSER', 'HR', 'IX',
								   'LBACSYS', 'MDDATA', 'MDSYS', 'OE', 'ORACLE_OCM',
								   'ORDDATA', 'ORDPLUGINS', 'ORDSYS', 'OUTLN', 'PM',
								   'SCOTT', 'SH', 'SI_INFORMTN_SCHEMA', 'SPATIAL_CSW_ADMIN_USR', 'SPATIAL_WFS_ADMIN_USR',
								   'SYS', 'SYSBACKUP', 'SYSDG', 'SYSKM', 'SYSTEM',
								   'WMSYS', 'XDB', 'SYSMAN', 'RMAN', 'RMAN_BACKUP',
								   'MT', 'OJVMSYS', 'OJVMSYS' )
					UNION ALL
					SELECT
						l.owner,
						l.table_name AS object_name,
						'TABLE'      AS object_type,
						l.table_name,
						s.bytes,
						s.tablespace_name,
						s.extents,
						s.initial_extent
					FROM
						dba_lobs     l,
						dba_segments s
					WHERE
							s.segment_name = l.segment_name
						AND s.owner = l.owner
						AND s.segment_type = 'LOBSEGMENT'
					AND s.owner NOT IN ( 'ANONYMOUS', 'APEX_030200', 'OLAPSYS', 'APEX_040200', 'APEX_PUBLIC_USER',
								   'APPQOSSYS', 'AUDSYS', 'BI', 'CTXSYS', 'DBSNMP',
								   'DIP', 'DVF', 'DVSYS', 'EXFSYS', 'FLOWS_FILES',
								   'GSMADMIN_INTERNAL', 'GSMCATUSER', 'GSMUSER', 'HR', 'IX',
								   'LBACSYS', 'MDDATA', 'MDSYS', 'OE', 'ORACLE_OCM',
								   'ORDDATA', 'ORDPLUGINS', 'ORDSYS', 'OUTLN', 'PM',
								   'SCOTT', 'SH', 'SI_INFORMTN_SCHEMA', 'SPATIAL_CSW_ADMIN_USR', 'SPATIAL_WFS_ADMIN_USR',
								   'SYS', 'SYSBACKUP', 'SYSDG', 'SYSKM', 'SYSTEM',
								   'WMSYS', 'XDB', 'SYSMAN', 'RMAN', 'RMAN_BACKUP',
								   'MT', 'OJVMSYS', 'OJVMSYS' )
				)
			GROUP BY
				owner,
				object_name,
				object_type
			ORDER BY topobjectsbysize_in_gb DESC
		) a
	WHERE
		topobjectsbysize_in_gb > 500
	),
	part_dtls as
	(
	select p1.table_owner, p1.table_name,
	p1.partitioning_type, p2. part_key_columns, p1.number_of_partitions,
	p1.subpartitioning_type, p3.subpart_key_columns, p1.number_of_subpartitions
	from
	(
	select p.table_owner, p.table_name, pt.partitioning_type, pt.subpartitioning_type,
	count(p.partition_name) as number_of_partitions, sum(p.SUBPARTITION_COUNT) as number_of_subpartitions
	from dba_tab_partitions p,
		 dba_part_tables pt,
		 table_size
	where p.table_owner = table_size.owner and p.table_name = table_size.segment_name
	and pt.table_name = p.table_name AND pt.owner = p.table_owner
	group by p.table_owner, p.table_name, pt.partitioning_type, pt.subpartitioning_type
	) p1,
	(
	select p.owner, p.name, listagg(p.COLUMN_NAME, ',') within group(order by p.COLUMN_POSITION)  as part_key_columns
	from dba_PART_KEY_COLUMNS p, table_size
	where p.owner = table_size.owner and p.name = table_size.segment_name
	and object_type = 'TABLE'
	group by p.owner, p.name
	) p2,
	(
	select p.owner, p.name, listagg(p.COLUMN_NAME, ',') within group(order by p.COLUMN_POSITION)  as subpart_key_columns
	from dba_subPART_KEY_COLUMNS p, table_size
	where p.owner = table_size.owner and p.name = table_size.segment_name
	and object_type = 'TABLE'
	group by p.owner, p.name
	) p3
	where p1.table_owner = p2.owner(+)
	and p1.table_name = p2.name(+)
	and p1.table_owner = p3.owner(+)
	and p1.table_name = p3.name(+)
	),
	pk_dtls as
	(
	select cons.owner, cols.table_name,
	listagg(cols.column_name, ',') within group(order by cols.position) as table_pk
	FROM dba_constraints cons, dba_cons_columns cols, 	table_size
	WHERE
	cons.owner = table_size.owner and cols.table_name = table_size.segment_name
	AND cons.constraint_type = 'P'
	AND cons.constraint_name = cols.constraint_name
	AND cons.owner = cols.owner
	and status = 'ENABLED'
	group by cons.owner, cols.table_name
	)
	select
	--table_size.segment_name, table_size.topobjectsbysize_in_gb, part_dtls.table_owner,
	--nvl(pk_dtls.table_pk, 'NA') as table_pk,
	--nvl(part_dtls.partitioning_type, 'NA') as partitioning_type, nvl(part_dtls.part_key_columns, 'NA') as part_key_columns,
	--nvl(part_dtls.number_of_partitions, 0) as number_of_partitions,
	--nvl(part_dtls.subpartitioning_type, 'NA') as subpartitioning_type,
	--nvl(part_dtls.subpart_key_columns, 'NA') as subpart_key_columns,
	--nvl(part_dtls.number_of_subpartitions, 0) as number_of_subpartitions,
	--DBMS_METADATA.GET_DDL('TABLE', table_size.segment_name, table_size.owner) as ddl_script,
			table_size.owner
		|| 'NG_DMAP_DELIMITER'
		|| table_size.segment_name
		|| 'NG_DMAP_DELIMITER'
		|| table_size.segment_type
		|| 'NG_DMAP_DELIMITER'
		|| table_size.topobjectsbysize_in_gb
		|| 'NG_DMAP_DELIMITER'
        || dbms_lob.substr(DBMS_METADATA.GET_DDL('TABLE', table_size.segment_name, table_size.owner),3000,1)
        || 'NG_DMAP_DELIMITER'
        || nvl(pk_dtls.table_pk, 'NA')
        || 'NG_DMAP_DELIMITER'
        || nvl(part_dtls.partitioning_type, 'NA')
        || 'NG_DMAP_DELIMITER'
        || nvl(part_dtls.part_key_columns, 'NA')
        || 'NG_DMAP_DELIMITER'
        || nvl(part_dtls.number_of_partitions, 0)
        || 'NG_DMAP_DELIMITER'
        || nvl(part_dtls.subpartitioning_type, 'NA')
        || 'NG_DMAP_DELIMITER'
        || nvl(part_dtls.subpart_key_columns, 'NA')
        || 'NG_DMAP_DELIMITER'
        || nvl(part_dtls.number_of_subpartitions, 0)
        ||'NG_DMAP_DELIMITER'
		|| 'NG_DMAP_END'  as tab_size
	from table_size, part_dtls, pk_dtls
	where table_size.owner = part_dtls.table_owner(+) and table_size.segment_name = part_dtls.table_name(+)
	and table_size.owner = pk_dtls.owner(+) and table_size.segment_name = pk_dtls.table_name(+)
;
prompt
prompt Script_End - Top Objects by Size


set lines 9000 ;
set trimspool on ;
set pages 9500 ;
set feedback off
set heading off

prompt Script_Start - Fetching top 5000 queries

SELECT DISTINCT t.sql_id||'NG_DMAP_DELIMITER'||t."total_percentage"||'NG_DMAP_DELIMITER'||t."execs"||'NG_DMAP_DELIMITER'||t."plans"||'NG_DMAP_DELIMITER'||t."buffers"||'NG_DMAP_DELIMITER'||t."elaptm_per_exec"||'NG_DMAP_DELIMITER'||t."cputm_per_exec"||'NG_DMAP_DELIMITER'||t."buffers_per_exec"||'NG_DMAP_DELIMITER'||t."rowproc_per_exec"||'NG_DMAP_DELIMITER'||t."diskreads_per_exec"||'NG_DMAP_DELIMITER'||t."dirwrites_per_exec"||'NG_DMAP_DELIMITER'||t."mod_and_act"||'NG_DMAP_DELIMITER'||dbms_lob.substr(c.sql_text,3400,1)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM
  ( SELECT *
  FROM
    (SELECT a.sql_id,
      ROUND(100*SUM(a.buffer_gets_delta)/SUM(SUM(a.buffer_gets_delta)) over (),1) as "total_percentage",
      SUM(a.executions_delta) "execs",
      COUNT(DISTINCT a.plan_hash_value) "plans",
      SUM(a.buffer_gets_delta) "buffers",
      ROUND(SUM(a.elapsed_time_delta)  /1000000 / DECODE(SUM(a.executions_delta),0,1,SUM(a.executions_delta)),2) "elaptm_per_exec",
      ROUND(SUM(a.cpu_time_delta)      /1000000 / DECODE(SUM(a.executions_delta),0,1,SUM(a.executions_delta)),2) "cputm_per_exec",
      ROUND(SUM(a.buffer_gets_delta)   / DECODE(SUM(a.executions_delta),0,1,SUM(a.executions_delta)),0) "buffers_per_exec",
      ROUND(SUM(a.rows_processed_delta)   / DECODE(SUM(a.executions_delta),0,1,SUM(a.executions_delta)),0) "rowproc_per_exec",
      ROUND(SUM(a.disk_reads_delta)    / DECODE(SUM(a.executions_delta),0,1,SUM(a.executions_delta)),0) "diskreads_per_exec",
      ROUND(SUM(a.direct_writes_delta) / DECODE(SUM(a.executions_delta),0,1,SUM(a.executions_delta)),0) "dirwrites_per_exec",
      trim(MAX(a.module))
      ||'<>'
      ||trim(MAX(a.action)) "mod_and_act"
    FROM dba_hist_sqlstat a,
      dba_hist_snapshot b
    WHERE a.instance_number = b.instance_number
    AND a.dbid = b.dbid
    AND a.snap_id = b.snap_id
    AND trunc(b.begin_interval_time) >= sysdate - 7
    GROUP BY a.sql_id
    ORDER BY "cputm_per_exec" DESC NULLS LAST
    )LAST
  WHERE rownum < 11
  ) t,
  dba_hist_sqltext c
WHERE t.sql_id = c.sql_id (+)
--ORDER BY t."buffers" DESC;
/
prompt
prompt Script_End - Fetching top 5000 queries


REM Ver 2.0 - awr_trend.sql
REM - changes done by Bharani on 03-08-2023 - jira ticket  3704/3793
REM  note : redoMB is having with digits as 4 numeric part and 2 decimal part without rounding off and represented as MB
REM         --ROUND (f.average / 1024 / 1024, 1)
REM         -- ROUND (f.average / 1024 / 1024, 2),
REM (f.average / 1024 / 1024 ) "redoMB"
col "begintm" for a30
col "endtm"   for a30
col "snaps" for a20
col "inst" for 9999999999
col "day" for a15
col "elap(min)"   for 99999
col "dbtm(min)"   for 99999
col "Host CPU%"   for 99999
col "Inst CPU%"   for 99999
col "actses(mx)" for a14
col "logons(mx)" for a14
col "sqlexec"   for 9999999999
col "lioblks"   for 9999999999
col "readioMB"  for 9999999999
col "writeioMB" for 9999999999
col "hardparse" for 9999999999
col "utrans"    for 9999999999
col "ucommits"  for 9999999999
col "urbacks"   for 9999999999
col "redoMB"    for 9999990000.99
col "blkchg"    for 9999999999
col "rdiops"    for 9999999999
col "wtiops"    for 9999999999
col "endses#" for 9999999999
set termout off
set verify off
set trimspool on
set linesize 2000
set longchunksize 200000
set long 200000
set pagesize 5000
set wrap on
set feedback off
set heading off

prompt Script_Start - AWR trend from dba_hist_snapshot for last 30 days

SELECT 
	subquery."inst"||'NG_DMAP_DELIMITER'||subquery."snaps"||'NG_DMAP_DELIMITER'||subquery."day"||'NG_DMAP_DELIMITER'||subquery."begintm"||'NG_DMAP_DELIMITER'||subquery."endtm"||'NG_DMAP_DELIMITER'||subquery."elap(min)"||'NG_DMAP_DELIMITER'||subquery."dbtm(min)"||'NG_DMAP_DELIMITER'||subquery."Host CPU%"||'NG_DMAP_DELIMITER'||subquery."Inst CPU%"||'NG_DMAP_DELIMITER'||subquery."actses(mx)"||'NG_DMAP_DELIMITER'||subquery."logons(mx)"||'NG_DMAP_DELIMITER'||subquery."sqlexec"||'NG_DMAP_DELIMITER'||subquery."lioblks"||'NG_DMAP_DELIMITER'||subquery."readioMB"||'NG_DMAP_DELIMITER'||subquery."writeioMB"||'NG_DMAP_DELIMITER'||subquery."hardparse"||'NG_DMAP_DELIMITER'||subquery."utrans"||'NG_DMAP_DELIMITER'||subquery."ucommits"||'NG_DMAP_DELIMITER'||subquery."urbacks"||'NG_DMAP_DELIMITER'||subquery."redoMB"||'NG_DMAP_DELIMITER'||subquery."blkchg"||'NG_DMAP_DELIMITER'||subquery."rdiops"||'NG_DMAP_DELIMITER'||subquery."wtiops"||'NG_DMAP_DELIMITER'||subquery."endses#"||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM (
	SELECT a.instance_number
			 "inst",
		 a.snap_id - 1 || '-' || a.snap_id
			 "snaps",
		 TO_CHAR (a.begin_interval_time, 'DAY')
			 "day",
		 TO_CHAR (a.begin_interval_time, 'DD-MON-YYYY HH24:MI:SS')
			 "begintm",
		 TO_CHAR (a.end_interval_time, 'DD-MON-YYYY HH24:MI:SS')
			 "endtm",
		 ROUND ((  CAST (a.end_interval_time AS DATE)
				- CAST (a.begin_interval_time AS DATE))
			 * 1440,
			 2)
			 AS "elap(min)",
		 ROUND ((b1.VALUE - b2.VALUE) / 1000000 / 60, 2)
			 "dbtm(min)",
		 ROUND (d.average, 2)
			 "Host CPU%",
		 ROUND (inst_cpu_util, 0)
			 "Inst CPU%",
		 ROUND (e.maxval, 0)
			 "actses(mx)",
		 ROUND (h.maxval, 0)
			 "logons(mx)",
		 ROUND (j.average, 0)
			 "sqlexec",
		 ROUND (o.average, 0)
			 "lioblks",
		 ROUND (p.average / 1024 / 1024, 0)
			 "readioMB",
		 ROUND (q.average / 1024 / 1024, 0)
			 "writeioMB",
		 ROUND (k.average, 0)
			 "hardparse",
		 ROUND (l.average, 0)
			 "utrans",
		 ROUND (l1.average, 0)
			 "ucommits",
		 ROUND (m.average, 0)
			 "urbacks",
		 (f.average / 1024 / 1024 )
			 "redoMB",
		 ROUND (g.average, 0)
			 "blkchg",
		 Avg_Reads_Io_Sec
			 "rdiops",
		 Avg_Writes_Io_Sec
			 "wtiops",
		 n.VALUE
			 "endses#"
	FROM dba_hist_snapshot         a,
		 dba_hist_sys_time_model   b1,
		 dba_hist_sys_time_model   b2,
		 dba_hist_sysmetric_summary d,
		 dba_hist_sysmetric_summary e,
		 dba_hist_sysmetric_summary f,
		 dba_hist_sysmetric_summary g,
		 dba_hist_sysmetric_summary h,
		 dba_hist_sysmetric_summary i,
		 dba_hist_sysmetric_summary j,
		 dba_hist_sysmetric_summary k,
		 dba_hist_sysmetric_summary l,
		 dba_hist_sysmetric_summary l1,
		 dba_hist_sysmetric_summary m,
		 dba_hist_sysmetric_summary o,
		 dba_hist_sysmetric_summary p,
		 dba_hist_sysmetric_summary q,
		 dba_hist_sysstat          n,
		 (SELECT snap_id,
				 instance_number,
				 dbid,
				 ROUND (cpu / elapsed_seconds / num_cpu * 100, 2)    inst_cpu_util
			FROM (SELECT t3.snap_id,
						 t3.instance_number,
						 t3.dbid,
						   ROUND ((t1.VALUE - t2.VALUE) / 1000000, 3)
						 + ROUND ((t4.VALUE - t5.VALUE) / 1000000, 3)
							 CPU,
						   (  EXTRACT (
								  HOUR FROM ((  t3.end_interval_time
											  - t3.begin_interval_time)))
							* 3600)
						 + (  EXTRACT (
								  MINUTE FROM ((  t3.end_interval_time
												- t3.begin_interval_time)))
							* 60)
						 + EXTRACT (
							   SECOND FROM ((  t3.end_interval_time
											 - t3.begin_interval_time)))
							 elapsed_seconds,
						 (SELECT VALUE
							FROM v$osstat
						   WHERE stat_name = 'NUM_CPUS')
							 num_cpu
					FROM dba_hist_sys_time_model t1,
						 dba_hist_sys_time_model t2,
						 dba_hist_sys_time_model t4,
						 dba_hist_sys_time_model t5,
						 dba_hist_snapshot      t3
				   WHERE     t1.dbid = t3.dbid
						 AND t1.snap_id = t3.snap_id
						 AND t1.instance_number = t3.instance_number
						 AND t1.stat_name = 'DB CPU'
						 AND t1.stat_name = t2.stat_name
						 AND t1.dbid = t2.dbid
						 AND t1.instance_number = t2.instance_number
						 AND t2.snap_id = (t1.snap_id - 1)
						 AND t4.dbid = t3.dbid
						 AND t4.snap_id = t3.snap_id
						 AND t4.instance_number = t3.instance_number
						 AND t4.stat_name = 'background cpu time'
						 AND t4.stat_name = t5.stat_name
						 AND t4.dbid = t5.dbid
						 AND t4.instance_number = t5.instance_number
						 AND t5.snap_id = (t4.snap_id - 1))) v1,
		 (SELECT snap.snap_id,
				 snap.instance_number,
				 snap.dbid,
				 ROUND (
					 ABS (
						   (A.VALUE - B.VALUE)
						 / (  (  EXTRACT (
									 HOUR FROM ((  Snap.End_Interval_Time
												 - Snap.Begin_Interval_Time)))
							   * 3600)
							+ (  EXTRACT (
									 MINUTE FROM ((  Snap.End_Interval_Time
												   - Snap.Begin_Interval_Time)))
							   * 60)
							+ EXTRACT (
								  SECOND FROM ((  snap.end_interval_time
												- snap.begin_interval_time))))))
					 Flash_Reads_IO_Sec,
				 ROUND (Read_Io.Average)
					 Avg_Reads_Io_Sec,
				 ROUND (Write_Io.Average)
					 Avg_Writes_Io_Sec,
				 ROUND (Read_Io.Maxval)
					 Max_Reads_Io_Sec,
				 ROUND (Write_Io.Maxval)
					 Max_Writes_Io_Sec
			FROM Dba_Hist_Snapshot         Snap,
				 Dba_Hist_Sysstat          A,
				 Dba_Hist_Sysstat          B,
				 Dba_Hist_Sysmetric_Summary Read_Io,
				 Dba_Hist_Sysmetric_Summary Write_Io
		   WHERE     a.dbid = snap.dbid
				 AND A.Snap_Id = Snap.Snap_Id
				 AND A.Instance_Number = Snap.Instance_Number
				 AND A.Stat_Name = 'physical read requests optimized'
				 AND a.dbid = b.dbid
				 AND B.Snap_Id = (A.Snap_Id - 1)
				 AND A.Stat_Name = B.Stat_Name
				 AND A.Instance_Number = B.Instance_Number
				 AND Snap.dbid = Read_Io.dbid
				 AND Snap.Snap_Id = Read_Io.Snap_Id
				 AND snap.Instance_Number = Read_Io.Instance_Number
				 AND Read_Io.Metric_Name =
					 'Physical Read Total IO Requests Per Sec'
				 AND Snap.dbid = write_Io.dbid
				 AND snap.Snap_Id = Write_Io.Snap_Id
				 AND snap.Instance_Number = Write_Io.Instance_Number
				 AND Write_Io.Metric_Name =
					 'Physical Write Total IO Requests Per Sec') v2
	WHERE     TRUNC (a.begin_interval_time) >= TRUNC (SYSDATE) - 1
		 AND a.dbid = b1.dbid
		 AND a.instance_number = b1.instance_number
		 AND a.snap_id = b1.snap_id
		 AND b1.stat_name = 'DB time'
		 AND b1.stat_name = b2.stat_name
		 AND b1.dbid = b2.dbid
		 AND b1.instance_number = b2.instance_number
		 AND b2.snap_id = (b1.snap_id - 1)
		 AND a.dbid = d.dbid
		 AND a.instance_number = d.instance_number
		 AND a.snap_id = d.snap_id
		 AND d.metric_name = 'Host CPU Utilization (%)'
		 AND a.dbid = e.dbid
		 AND a.instance_number = e.instance_number
		 AND a.snap_id = e.snap_id
		 AND e.metric_name = 'Average Active Sessions'
		 AND a.dbid = f.dbid
		 AND a.instance_number = f.instance_number
		 AND a.snap_id = f.snap_id
		 AND f.metric_name = 'Redo Generated Per Sec'
		 AND a.dbid = g.dbid
		 AND a.instance_number = g.instance_number
		 AND a.snap_id = g.snap_id
		 AND g.metric_name = 'DB Block Changes Per Sec'
		 AND a.dbid = h.dbid
		 AND a.instance_number = h.instance_number
		 AND a.snap_id = h.snap_id
		 AND h.metric_name = 'Logons Per Sec'
		 AND a.dbid = i.dbid
		 AND a.instance_number = i.instance_number
		 AND a.snap_id = i.snap_id
		 AND i.metric_name = 'Average Synchronous Single-Block Read Latency'
		 AND a.dbid = j.dbid
		 AND a.instance_number = j.instance_number
		 AND a.snap_id = j.snap_id
		 AND j.metric_name = 'Executions Per Sec'
		 AND a.dbid = k.dbid
		 AND a.instance_number = k.instance_number
		 AND a.snap_id = k.snap_id
		 AND k.metric_name = 'Hard Parse Count Per Sec'
		 AND a.dbid = l.dbid
		 AND a.instance_number = l.instance_number
		 AND a.snap_id = l.snap_id
		 AND l.metric_name = 'User Transaction Per Sec'
		 AND a.dbid = l1.dbid
		 AND a.instance_number = l1.instance_number
		 AND a.snap_id = l1.snap_id
		 AND l1.metric_name = 'User Commits Per Sec'
		 AND a.dbid = m.dbid
		 AND a.instance_number = m.instance_number
		 AND a.snap_id = m.snap_id
		 AND m.metric_name = 'User Rollbacks Per Sec'
		 AND a.dbid = n.dbid
		 AND a.instance_number = n.instance_number
		 AND a.snap_id = n.snap_id
		 AND n.stat_name = 'logons current'
		 AND a.dbid = v1.dbid
		 AND a.instance_number = v1.instance_number
		 AND a.snap_id = v1.snap_id
		 AND a.dbid = v2.dbid
		 AND a.instance_number = v2.instance_number
		 AND a.snap_id = v2.snap_id
		 AND a.dbid = o.dbid
		 AND a.instance_number = o.instance_number
		 AND a.snap_id = o.snap_id
		 AND o.metric_name = 'Logical Reads Per Sec'
		 AND a.dbid = p.dbid
		 AND a.instance_number = p.instance_number
		 AND a.snap_id = p.snap_id
		 AND p.metric_name = 'Physical Read Bytes Per Sec'
		 AND a.dbid = q.dbid
		 AND a.instance_number = q.instance_number
		 AND a.snap_id = q.snap_id
		 AND q.metric_name = 'Physical Write Bytes Per Sec'
	ORDER BY a.snap_id, a.instance_number
) subquery;
/
prompt
prompt Script_End - AWR trend from dba_hist_snapshot for last 30 days


spool off
quit;
/