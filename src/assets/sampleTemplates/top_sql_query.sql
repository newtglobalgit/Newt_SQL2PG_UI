spool <<dmap_db_script_output_path>>
--spool C:\Users\dsure\Downloads\Final_new_scripts\top_sql_query.txt

set lines 9000 ;
set trimspool on ;
set pages 9500 ;
set feedback off
set heading off

prompt Script_Start - Fetching top 5000 queries

SELECT DISTINCT t.sql_id||'NG_DMAP_DELIMITER'||t."total_percentage"||'NG_DMAP_DELIMITER'||t."execs"||'NG_DMAP_DELIMITER'||t."plans"||'NG_DMAP_DELIMITER'||t."buffers"||'NG_DMAP_DELIMITER'||t."elaptm_per_exec"||'NG_DMAP_DELIMITER'||t."cputm_per_exec"||'NG_DMAP_DELIMITER'||t."buffers_per_exec"||'NG_DMAP_DELIMITER'||t."rowproc_per_exec"||'NG_DMAP_DELIMITER'||t."diskreads_per_exec"||'NG_DMAP_DELIMITER'||t."dirwrites_per_exec"||'NG_DMAP_DELIMITER'||t."mod_and_act"||'NG_DMAP_DELIMITER'||dbms_lob.substr(c.sql_text,200,1)||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
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
    AND trunc(b.begin_interval_time) >= sysdate - 30 
    GROUP BY a.sql_id
    ORDER BY 5 DESC NULLS LAST
    )LAST
  WHERE rownum < 5001
  ) t,
  dba_hist_sqltext c
WHERE t.sql_id = c.sql_id (+)
--ORDER BY t."buffers" DESC;
/
prompt
prompt Script_End - Fetching top 5000 queries
spool off
quit;
/