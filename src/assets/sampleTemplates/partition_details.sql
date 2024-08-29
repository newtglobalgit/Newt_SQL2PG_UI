spool <<dmap_db_script_output_path>>
--spool C:\Users\dsure\Downloads\Final_new_scripts\partition_details.txt
/*Find encrypted tablespace details*/
col TABLESPACE_NAME for a13
col BLOCK_SIZE for     999999999999
col INITIAL_EXTENT for 999999999999
col NEXT_EXTENT for    999999999999 
col MIN_EXTENTS  for   999999999999 
col MAX_EXTENTS for    999999999999 
col MAX_SIZE for       999999999999 
col PCT_INCREASE for   999999999999 
col MIN_EXTLEN for     999999999999 
col STATUS for  a9
col CONTENTS for  a9
col LOGGING for  a9
col FORCE_LOGGING for  a3
col EXTENT_MANAGEMENT for  a10
col ALLOCATION_TYPE for  a9
col PLUGGED_IN for  a3
col SEGMENT_SPACE_MANAGEMENT for  a6
col DEF_TAB_COMPRESSION for  a8
col RETENTION for  a11
col BIGFILE for  a3
col PREDICATE_EVALUATION for  a7
col ENCRYPTED for  a3
col COMPRESS_FOR for  a12
set trimspool on ;
set termout off
set verify off
set trimspool on
set linesize 15000
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
set heading off

prompt Script_Start - Find encrypted tablespace details
set heading on
col TABLESPACE_NAME for a13
set heading off
SELECT 
TABLESPACE_NAME||'NG_DMAP_DELIMITER'||BLOCK_SIZE||'NG_DMAP_DELIMITER'||INITIAL_EXTENT||'NG_DMAP_DELIMITER'||NEXT_EXTENT||'NG_DMAP_DELIMITER'||MIN_EXTENTS||'NG_DMAP_DELIMITER'||MAX_EXTENTS||'NG_DMAP_DELIMITER'||MAX_SIZE||'NG_DMAP_DELIMITER'||PCT_INCREASE||'NG_DMAP_DELIMITER'||MIN_EXTLEN||'NG_DMAP_DELIMITER'||STATUS||'NG_DMAP_DELIMITER'||CONTENTS||'NG_DMAP_DELIMITER'||LOGGING||'NG_DMAP_DELIMITER'||FORCE_LOGGING||'NG_DMAP_DELIMITER'||EXTENT_MANAGEMENT||'NG_DMAP_DELIMITER'||ALLOCATION_TYPE||'NG_DMAP_DELIMITER'||PLUGGED_IN||'NG_DMAP_DELIMITER'||SEGMENT_SPACE_MANAGEMENT||'NG_DMAP_DELIMITER'||DEF_TAB_COMPRESSION||'NG_DMAP_DELIMITER'||RETENTION||'NG_DMAP_DELIMITER'||BIGFILE||'NG_DMAP_DELIMITER'||PREDICATE_EVALUATION||'NG_DMAP_DELIMITER'||ENCRYPTED||'NG_DMAP_DELIMITER'||COMPRESS_FOR||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
FROM DBA_TABLESPACES
WHERE ENCRYPTED <> 'NO'
;
prompt
set heading off
prompt Script_End - Find encrypted tablespace details
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
WITH
    SP
    AS
        (  SELECT DISTINCT a.owner,
                           a.table_name,
                           a.SUBPARTITIONING_TYPE,
                           COUNT (c.subpartition_name)     SUBPARTITION_COUNT
             FROM DBA_PART_TABLES A, DBA_TAB_SUBPARTITIONS C
            WHERE     A.OWNER = C.TABLE_OWNER
                  AND A.TABLE_NAME = C.TABLE_NAME
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
         GROUP BY a.owner,
                  a.table_name,
                  a.partitioning_type,
                  a.SUBPARTITIONING_TYPE),
    P
    AS
        (  SELECT DISTINCT a.owner,
                           a.table_name,
                           a.partitioning_type,
                           COUNT (b.PARTITION_NAME)     PARTITION_COUNT
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
         GROUP BY a.owner, a.table_name, a.partitioning_type)
SELECT DISTINCT P.owner||'NG_DMAP_DELIMITER'||P.table_name||'NG_DMAP_DELIMITER'||NVL (P.PARTITIONING_TYPE, 'NA')||'NG_DMAP_DELIMITER'||NVL (P.PARTITION_COUNT, 0)||'NG_DMAP_DELIMITER'||NVL (SP.SUBPARTITIONING_TYPE, 'NA')||'NG_DMAP_DELIMITER'||NVL (SP.SUBPARTITION_COUNT, 0)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
  FROM P, SP
 WHERE P.OWNER = SP.OWNER(+) AND P.TABLE_NAME = SP.TABLE_NAME(+) 
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
order by size_mb desc) 
group by owner , table_name
/
prompt
prompt Script_End - List of partition in order of there size with table and schema name
spool off
quit;
/