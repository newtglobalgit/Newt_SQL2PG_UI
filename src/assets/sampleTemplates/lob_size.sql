--Script to pull the size of LOB objects
Set pagesize 100
set lines 100
col name format a48
Col bytes format 999,999,999,999

SELECT
    'Table with LOBs' as Param
    ,a.owner
    ,a.table_name
    ,a.column_name
    ,a.data_type
    ,bytes / 1024 / 1024 "Size MB"
    FROM
    dba_tab_columns   a,
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
    "Size MB" DESC;

--Query for getting the percentage of text data in Oracle database - schemawise

select owner,sum(actual_size_mb) actual_size_mb, sum(total_size_mb) total_size_mb,
sum(round((actual_size_mb/ total_size_mb)*100 , 10)) ||'%'percentage_used_size
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
order by percentage_used_size desc;
/

--Query for getting the percentage of text data in Oracle database - complete db
select sum(actual_size_mb) actual_size_mb, sum(total_size_mb) total_size_mb,
sum(round((actual_size_mb/ total_size_mb)*100 , 10)) ||'%'percentage_used_size
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
order by percentage_used_size desc;
/