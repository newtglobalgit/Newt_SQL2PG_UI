    SET ECHO OFF
    set wrap off
	set trim on
    COL USERNAME FOR A20
    COL VALID FOR A3
    COL INTRA_CDB FOR A3
    COLUMN event FORMAT A100
    set heading off
    SET PAGESIZE 999
    SET LINE 600
    COL SEGMENT_NAME FOR A30
    COL OBJECT_NAME FOR A30
    COL OWNER FOR A30
    COL TABLE_NAME FOR A30
    COL NAME FOR A60
    COL BANNER FOR A80
    COL PORT_STRING FOR A60
    COL DATA_TYPE FOR A30
    COL PARTITION_NAME FOR A30
    COL COLUMN_NAME FOR A30
    COL CONSTRAINT_NAME FOR A30
    COL DEFAULT_DIRECTORY_NAME FOR A60
    COL PROFILE FOR A30
    COL LIMIT FOR A40
    COL RESOURCE_NAME FOR A32
    COL RESOURCE_TYPE FOR A20
    COL HOST FOR A20
    COL DISPLAY_VALUE FOR A30
    col  METRIC_NAME for a50
    col METRIC_UNIT for a50
    col TABLE_OWNER for a30
    column event for a30
    column "%age of wait" for 999.99

   set heading off
   
    SELECT '#######################################' FROM DUAL; 
    
	set heading on
       SELECT 'Version' as Param
    , Banner
    FROM
    v$version;

    SELECT
    'Operating System' as Param
    , dbms_utility.port_string
    FROM
    dual;

    COLUMN name  FORMAT A60
    COLUMN detected_usages FORMAT 999999999999

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
    SELECT  'Feature Usage' as param, u1.name,
     u1.detected_usages,
     u1.currently_used,
     u1.version
    FROM   dba_feature_usage_statistics u1
    WHERE  u1.version = (SELECT MAX(u2.version)
                   FROM   dba_feature_usage_statistics u2
                   WHERE  u2.name = u1.name)
    AND    u1.detected_usages > 0
    AND    u1.dbid = (SELECT dbid FROM v$database)
    ORDER BY name;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on


    SELECT
    'SGA Size' as Param
    ,name
    ,value / 1024 / 1024 "SGA (MB)"
    FROM
    v$sga;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
    SELECT
    'RAC Database' as Param
    ,COUNT(*)
    FROM
    v$instance;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
    SELECT
    'Dataguard' as Param
    ,COUNT(*)
    FROM
    v$archive_dest
    WHERE
    status = 'VALID';

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
    col value for A60
    col db_link for A60
    col host for A60
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
	--     select 'NLS Parameters' as Param, a.* from nls_database_parameters  a where parameter='NLS_CHARACTERSET';
    --  select 'Database property' * from database_properties; -- leon (This line has error, modifed. Next line is corrected code)
col DESCRIPTION for a200
column PROPERTY_VALUE format a50
column PROPERTY_NAME format a50
column PARAM format a50
      select 'Database property' as param,  a.* from database_properties a; 
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on

     SELECT 'DB Time Zone' as Param , DBTIMEZONE FROM DUAL;
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
      select 'External table' as param, owner,table_name,default_directory_name from  dba_external_tables;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
      select 'Password function' as param, a.* from dba_profiles a where resource_name like 'PASSWORD_VERIFY%';
	  
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
      select 'DB Link' as Param, a.* from dba_db_links a;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	

    select 'Sum DBA_Segments' as param, sum(bytes)/1024/1024/1024 from dba_segments;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    select 'Sum DBA_DATA_FILES' as Param,sum(bytes)/1024/1024/1024 from dba_data_files;
    
	   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
	select 'Sum DBA_TEMP_FILES' as param, sum(bytes)/1024/1024/1024 from dba_temp_files;
    
	   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
	select 'DMS Un-supported' as Param, owner, table_name,column_name
    from dba_tab_columns
    where data_type in ('BFILE','ROWID','REF','UROWID','ANYDATA')
    AND owner NOT IN (
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
    );



   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on

    select 'Init parameter' as Param,name, type,DISPLAY_VALUE
    from v$parameter
    where name in ('memory_max_target','memory_target','pga_aggregate_target','pga_aggregate_target','undo_retention')
    ORDER BY 1;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
        'Logging at database' as Param
        ,force_logging,
        supplemental_log_data_fk,
        supplemental_log_data_all,
        supplemental_log_data_min,
        supplemental_log_data_pk, supplemental_log_data_ui
    FROM v$database;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
  SELECT
        'Logging at tablespace' as Param
        ,tablespace_name,
        force_logging
    FROM
        dba_tablespaces
    ORDER BY
        1;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
      'Redo Sizes' as Param
      ,group#,
      thread#,
      bytes / 1024
    FROM
      gv$log
    ORDER BY
      1,
      2;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
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
	
    set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
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
    /


   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT  INSTANCE_NUMBER, METRIC_NAME, METRIC_UNIT, ROUND(AVG(MINVAL),2) AVG_MINVAL, ROUND(AVG(MAXVAL),2) AVG_MAXVAL, ROUND(AVG(AVERAGE),2) AVG_AVGCAL
    FROM    DBA_HIST_SNAPSHOT NATURAL JOIN DBA_HIST_SYSMETRIC_SUMMARY
    WHERE   BEGIN_INTERVAL_TIME >= TRUNC(SYSDATE - 7 )
    AND     BEGIN_INTERVAL_TIME <= TRUNC (SYSDATE)
    AND     METRIC_NAME IN
    (
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
    GROUP BY  INSTANCE_NUMBER, METRIC_NAME, METRIC_UNIT
    ORDER BY 2,1;
	
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on

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
    column Physical_Read_IOPS heading "Total Reads|(Thousands)"
    column Physical_write_IOPS heading "Total Writes|(Thousands)"
	
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on

    select  'Generating CDC specific load summary' as Param
      ,max(end_time),
    --       round(sum(case metric_name when 'Physical Write Total Bytes Per Sec' then average*(INTSIZE/100) end)/1024) Physical_Write_Total_KBps,
     round(sum(case metric_name when 'Redo Generated Per Sec' then average*(INTSIZE/100) end)/1024/1024) Redo_MBytes,
     round(avg(case metric_name when 'Redo Generated Per Txn' then average end)/1024) Redo_KBytes_per_TXN,
    --       round(sum(case metric_name when 'Redo Writes Per Sec' then average*(INTSIZE/100) end)) redo_IOPS,
     round((sum(case metric_name when 'Physical Read Total IO Requests Per Sec' then average*(INTSIZE/100) end))/1000) Physical_Read_IOPS,
     round((sum(case metric_name when 'Physical Write Total IO Requests Per Sec' then average*(INTSIZE/100) end))/1000) Physical_write_IOPS,
     round(sum(case metric_name when 'DB Block Changes Per Sec' then average*(INTSIZE/100) end)/1024) BLK_CHANGES,
     round(avg(case metric_name when 'DB Block Changes Per Txn' then average end)/1024) BLK_CHANGES_per_TXN,
     round(max(case metric_name when 'DB Block Changes Per Txn' then MAXVAL end)) MAX_BLK_CHANGES_per_TXN,
     round(avg(case metric_name when 'DB Block Changes Per User Call' then average end)/1024) BLK_CHANGES_per_CALL,
     round(max(case metric_name when 'DB Block Changes Per User Call' then MAXVAL end)) MAX_BLK_CHANGES_per_CALL,
     round(avg(case metric_name when 'Current OS Load' then average end)) OS_LOad,
    --       round(sum(case metric_name when 'CPU Usage Per Sec' then average*(INTSIZE/100) end)) DB_CPU_Usage_per_sec,
     round(avg(case metric_name when 'Host CPU Utilization (%)' then average end)) CPU_util, --NOTE 100% = 1 loaded RAC node
     round(avg(case metric_name when 'Network Traffic Volume Per Sec' then average end)/1024/1024) Network_MBytes_per_sec
    from dba_hist_sysmetric_summary
    where begin_time >= sysdate - 7
    group by snap_id
    order by snap_id;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'MVIEWS' as Param
    ,OWNER
    ,MVIEW_NAME
    FROM dba_mviews
    WHERE OWNER NOT IN('ANONYMOUS','APEX_030200','OLAPSYS' ,'APEX_040200','APEX_PUBLIC_USER','APPQOSSYS','AUDSYS','BI','CTXSYS','DBSNMP','DIP','DVF','DVSYS','EXFSYS','FLOWS_FILES','GSMADMIN_INTERNAL','GSMCATUSER','GSMUSER','HR','IX','LBACSYS','MDDATA','MDSYS','OE','ORACLE_OCM' ,'ORDDATA','ORDPLUGINS','ORDSYS','OUTLN','PM','SCOTT','SH','SI_INFORMTN_SCHEMA','SPATIAL_CSW_ADMIN_USR','SPATIAL_WFS_ADMIN_USR','SYS','SYSBACKUP','SYSDG','SYSKM','SYSTEM','WMSYS','XDB','SYSMAN','RMAN','RMAN_BACKUP','MT','OJVMSYS')
    ORDER BY 1,2;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Schema Sizes' as Param
    ,owner
    ,round(SUM(bytes) / 1024 / 1024 / 1024) "SIZE IN GIGS"
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
    3;


   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'No. of Columns in Tables' as Param
    , owner
    , table_name,
    COUNT(*) AS no_of_columns
    FROM
    dba_tab_columns
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
    GROUP BY
    owner,
    table_name
    ORDER BY
    2,
    3,
    4;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on

    SELECT
    'Top Objects by Size' as Param
    , a.*
    FROM
    (
    SELECT
      owner,
      segment_name,
      segment_type,
      round((SUM(bytes)) / 1024 / 1024 / 1024) gigs
    FROM
      dba_segments
    WHERE
      segment_type != 'INDEX'
      AND owner NOT IN (
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
          'MT','OJVMSYS',
          'OJVMSYS'
      )
    GROUP BY
      owner,
      segment_name,
      segment_type
    ORDER BY
      round((SUM(bytes)) / 1024 / 1024 / 1024) DESC
    ) a
    WHERE
    ROWNUM <= 200;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Count for object types' as Param
    ,owner
    ,object_type
    ,status
    ,COUNT(*)
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
    GROUP BY
    owner
    ,object_type
    ,status
    ORDER BY
    2,
    3,
    4;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on

    SELECT
    'Count for data types' as Param
    ,owner
    ,data_type
    ,COUNT(*)
    FROM
    dba_tab_columns
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
    GROUP BY
    owner,
    data_type
    ORDER BY
    1,
    2,
    3;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on

    set line 200
    COLUMN owner FORMAT a15
    COLUMN degree FORMAT a8

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Table rows stats' as Param
    ,owner
    ,table_name
    ,num_rows
    ,blocks
    ,empty_blocks
    ,avg_space
    ,avg_row_len
    ,last_analyzed
    ,partitioned
    ,logging
    ,TRIM(degree) degree
    ,compression
    FROM
    dba_tables
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
    ORDER BY
    2,
    3,
    4;

SELECT '#######################################' FROM DUAL; 
    SELECT
    'Info from dba_tab_modifications' as Param
    ,table_owner
    ,table_name
    ,partition_name
    ,inserts
    ,updates
    ,deletes
    FROM
    dba_tab_modifications
    WHERE
    table_owner NOT IN (
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
    ORDER BY
    2,
    3;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SET LINESIZE 220
    BREAK ON owner SKIP 1
    COLUMN data_type FORMAT a30

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
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
    AND upper(a.table_name) NOT IN (
    'AMAZON_APPLY_EXCEPTIONS',
    'AWSDMS_APPLY_EXCEPTIONS'
    )
    ORDER BY
    owner,
    "Size MB",
    table_name;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Parition Count per table' as Param
    , a.*
    FROM
    (
    SELECT
      table_owner,
      table_name,
      COUNT(*)
    FROM
      dba_tab_partitions
    WHERE
      table_owner NOT IN (
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
    GROUP BY
      table_owner,
      table_name
    ORDER BY
      3 DESC
    ) a
    WHERE
    ROWNUM < 100;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Sub Partition count per partition' as Param
    ,a.*
    FROM
    (
    SELECT
      table_owner,
      table_name,
      COUNT(*) "Partition Count",
      SUM(subpartition_count) "SUB Partition Count"
    FROM
      dba_tab_partitions
    WHERE
      table_owner NOT IN (
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
    GROUP BY
      table_owner,
      table_name
    ORDER BY
      3 DESC
    ) a
    WHERE
    ROWNUM < 100;


   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'PRIMARY Key info' as Param
    ,cons.owner
    ,cols.table_name
    ,cons.constraint_name
    ,cols.column_name
    ,cols.position
    ,cons.status
    FROM
    all_constraints    cons,
    all_cons_columns   cols
    WHERE
    cons.constraint_type = 'P'
    AND cons.constraint_name = cols.constraint_name
    AND cons.owner = cols.owner
    AND cons.owner NOT IN (
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
    ORDER BY
    cols.table_name,
    cols.position;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    column COLUMN_NAME format a30

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'More LOBs Info' as Param,
    OWNER,TABLE_NAME,COLUMN_NAME,SEGMENT_NAME,CHUNK,IN_ROW,SECUREFILE
    FROM dba_lobs
    WHERE owner NOT IN ('ANONYMOUS','APEX_030200','OLAPSYS' ,'APEX_040200','APEX_PUBLIC_USER','APPQOSSYS','AUDSYS','BI','CTXSYS','DBSNMP','DIP','DVF','DVSYS','EXFSYS','FLOWS_FILES','GSMADMIN_INTERNAL','GSMCATUSER','GSMUSER','HR','IX','LBACSYS','MDDATA','MDSYS','OE','ORACLE_OCM' ,'ORDDATA','ORDPLUGINS','ORDSYS','OUTLN','PM','SCOTT','SH','SI_INFORMTN_SCHEMA','SPATIAL_CSW_ADMIN_USR','SPATIAL_WFS_ADMIN_USR','SYS','SYSBACKUP','SYSDG','SYSKM','SYSTEM','WMSYS','XDB','SYSMAN','RMAN','RMAN_BACKUP','MT','OJVMSYS')
    ORDER BY OWNER,TABLE_NAME;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'LOB column with NOT NULL set as Param'
    ,OWNER,TABLE_NAME,COLUMN_NAME,DATA_TYPE
    FROM dba_tab_columns
    WHERE DATA_TYPE IN('BLOB','CLOB','LONG','LONG RAW','NCLOB','XMLTYPE')
    AND owner NOT IN('ANONYMOUS','APEX_030200','OLAPSYS' ,'APEX_040200','APEX_PUBLIC_USER','APPQOSSYS','AUDSYS','BI','CTXSYS','DBSNMP','DIP','DVF','DVSYS','EXFSYS','FLOWS_FILES','GSMADMIN_INTERNAL','GSMCATUSER','GSMUSER','HR','IX','LBACSYS','MDDATA','MDSYS','OE','ORACLE_OCM' ,'ORDDATA','ORDPLUGINS','ORDSYS','OUTLN','PM','SCOTT','SH','SI_INFORMTN_SCHEMA','SPATIAL_CSW_ADMIN_USR','SPATIAL_WFS_ADMIN_USR','SYS','SYSBACKUP','SYSDG','SYSKM','SYSTEM','WMSYS','XDB','SYSMAN','RMAN','RMAN_BACKUP','MT','OJVMSYS')
    AND NULLABLE='N'
    ORDER BY 1,2;
	
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	

    SELECT
    'Top Objects by block Changes' as Param,
    a.*
    FROM
    (
      SELECT
          owner,
          object_name,
          object_type,
          SUM(db_block_changes_delta) "Block Changes"
      FROM
          dba_hist_seg_stat
          NATURAL JOIN dba_hist_snapshot
          NATURAL JOIN dba_hist_seg_stat_obj
      WHERE
          begin_interval_time > SYSDATE - 7
          AND object_type != 'INDEX'
              AND owner NOT IN (
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
      GROUP BY
          owner,
          object_name,
          object_type
      ORDER BY
          4 DESC
    ) a
    WHERE
    ROWNUM < 51;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
      'Tables without PKs' as Param
      ,owner
      ,table_name
    FROM
      dba_tables
    WHERE
      owner = 'D_TYPES3'
    MINUS
    SELECT
      'Tables without PKs'
      ,owner
      ,table_name
    FROM
      dba_constraints
    WHERE
      ( constraint_type = 'P' )
      AND owner NOT IN (
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
      );

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	

    SELECT
    'Long runing SQL' as Param
    ,end_interval_time,
    MAX(round(maxquerylen / 60)) "Query Length in minutes"
    FROM
    dba_hist_undostat
    NATURAL JOIN dba_hist_snapshot
    WHERE
    end_interval_time > SYSDATE - 3
    GROUP BY
    end_interval_time
    ORDER BY
    1;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    ALTER SESSION SET nls_date_format = 'DD-MM-YYYY HH24:MI:SS';

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Oldest transaction with Block change' as Param
    ,SYSDATE "Current Time",
    MIN(TO_DATE(start_time, 'MM/DD/YY HH24:MI:SS')) "Oldest Transaction Start time",
    ( SYSDATE - MIN(TO_DATE(start_time, 'MM/DD/YY HH24:MI:SS')) ) "Transaction duration"
    FROM
    v$transaction
    WHERE
    cr_change > 0;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on



    SELECT
    'Redo Per/Day' as Param
    ,inst_id
    ,trunc(completion_time) rundate,
    COUNT(*) logswitch,
    round((SUM(blocks * block_size) / 1024 / 1024)) "REDO PER DAY (MB)"
    FROM
    gv$archived_log
    WHERE
    completion_time > SYSDATE - 7
    GROUP BY
    inst_id,trunc(completion_time)
    ORDER BY
    2,3;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	

    ALTER SESSION SET nls_date_format = 'DD-MM-YYYY HH24';


   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Redo Per/Hour' as Param
    ,inst_id
    ,TO_DATE(completion_time, 'DD-MM-YYYY HH24') rundate,
    COUNT(*) logswitch,
    round((SUM(blocks * block_size) / 1024 / 1024)) "REDO PER HOUR (MB)"
    FROM
    gv$archived_log
    WHERE
    completion_time > SYSDATE - 7
    GROUP BY
    inst_id, TO_DATE(completion_time, 'DD-MM-YYYY HH24')
    ORDER BY
    2,3;

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on



    SELECT
    'DB Block Changes per sec by Day' as Param,
    TO_CHAR(begin_time, 'DD-MM-YYYY') day,
    round(AVG(average)) "DB Block Changes Per Sec"
    FROM
    dba_hist_sysmetric_summary
    WHERE
    metric_name = 'DB Block Changes Per Sec'
    AND begin_time >= SYSDATE - 7
    GROUP BY
    TO_CHAR(begin_time, 'DD-MM-YYYY')
    ORDER BY
    TO_CHAR(begin_time, 'DD-MM-YYYY');

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    SELECT
    'Block changes per sec by  hour ' as Param
    ,TO_CHAR(begin_time, 'DD-MM-YYYY HH24') day,
    round(AVG(average)) "DB Block Changes Per Sec"
    FROM
    dba_hist_sysmetric_summary
    WHERE
    metric_name = 'DB Block Changes Per Sec'
    AND begin_time >= SYSDATE - 7
    GROUP BY
    TO_CHAR(begin_time, 'DD-MM-YYYY HH24')
    ORDER BY
    TO_CHAR(begin_time, 'DD-MM-YYYY HH24');

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    compute sum of cnt on report
    compute sum of "%age of wait" on report
    break on report

   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    select event,  cnt,
    (ratio_to_report(cnt) over ())*100 "%age of wait" from (
    select event, sum(cnt) cnt from (
    select case when event='latch free' and p2=(select latch# from v$latch where name='library cache') then event||'. Library Cache' else  event end event, 1 cnt
    from v$session_wait
    where event not like '%messag%')
    group by event
    order by 2);
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
	
    select 'Hidden parameters' as Param, name, value from v$parameter where name like '\_%' escape '\';
   set heading off
    SELECT '#######################################' FROM DUAL; 
	set heading on
