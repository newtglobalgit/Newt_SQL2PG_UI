SELECT a.instance_number "inst",

  a.snap_id-1||'-'||a.snap_id "snaps",

  TO_CHAR(a.begin_interval_time,'DAY') "day",

  TO_CHAR(a.begin_interval_time, 'DD-MON-YYYY HH24:MI:SS') "begintm",

  TO_CHAR(a.end_interval_time, 'DD-MON-YYYY HH24:MI:SS') "endtm",

  ROUND((CAST(a.end_interval_time AS DATE)-CAST(a.begin_interval_time AS DATE)) * 1440,2) AS "elap(min)",

  ROUND((b1.value -b2.value)/1000000/60,2) "dbtm(min)",

--  ROUND(d.average,2)||'=>'||ROUND(d.maxval,2) "Host CPU%(av=>mx)",

  ROUND(d.average,2) "Host CPU%",

  round(inst_cpu_util,0) "Inst CPU%",

  ROUND(e.average,0)||'=>'||ROUND(e.maxval,0) "actses(av=>mx)",

  ROUND(h.average,0)||'=>'||ROUND(h.maxval,0) "logons(av=>mx)",

  ROUND(j.average,0) "sqlexec",

  ROUND(o.average,0) "lioblks",

  ROUND(p.average/1024/1024,0) "readioMB",

  ROUND(q.average/1024/1024,0) "writeioMB",

  ROUND(k.average,0) "hardparse",

  ROUND(l.average,0) "utrans",

  ROUND(l1.average,0) "ucommits",

  ROUND(m.average,0) "urbacks",

  ROUND(f.average/1024/1024,1) "redoMB",

  ROUND(g.average,0) "blkchg",

--  ROUND(i.average,2) "avsglblkrdltc(ms)",

--  Avg_Reads_Io_Sec||'=>'||Max_Reads_Io_Sec "rdiops(av=>mx)",

  Avg_Reads_Io_Sec "rdiops",

--  Avg_Writes_Io_Sec||'=>'||Max_Writes_Io_Sec "wtiops(av=>mx)",

  Avg_Writes_Io_Sec "wtiops",

--  Flash_Reads_IO_Sec "flshreadiops",

  n.value "endses#"

FROM dba_hist_snapshot a,

  dba_hist_sys_time_model b1,

  dba_hist_sys_time_model b2,

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

  dba_hist_sysstat n,

  (SELECT snap_id,

    instance_number,

    dbid,

    ROUND(cpu/elapsed_seconds/num_cpu*100,2) inst_cpu_util

  FROM

    (SELECT t3.snap_id,

      t3.instance_number,

      t3.dbid,

      ROUND((t1.value -t2.value)/1000000,3)+ROUND((t4.value -t5.value)/1000000,3) CPU,

      (Extract(hour FROM ((t3.end_interval_time - t3.begin_interval_time))) * 3600) + (Extract(minute FROM ((t3.end_interval_time - t3.begin_interval_time))) *60) + Extract(second FROM ((t3.end_interval_time - t3.begin_interval_time))) elapsed_seconds,

      (SELECT value FROM v$osstat WHERE stat_name = 'NUM_CPUS'

      ) num_cpu

    FROM dba_hist_sys_time_model t1,

      dba_hist_sys_time_model t2,

      dba_hist_sys_time_model t4,

      dba_hist_sys_time_model t5,

      dba_hist_snapshot t3

    WHERE t1.dbid          = t3.dbid

    AND t1.snap_id         = t3.snap_id

    AND t1.instance_number = t3.instance_number

    AND t1.stat_name       = 'DB CPU'

    AND t1.stat_name       = t2.stat_name

    AND t1.dbid            = t2.dbid

    AND t1.instance_number = t2.instance_number

    AND t2.snap_id         = (t1.snap_id -1)

    and t4.dbid          = t3.dbid

    AND t4.snap_id         = t3.snap_id

    AND t4.instance_number = t3.instance_number

    AND t4.stat_name       = 'background cpu time'

    AND t4.stat_name       = t5.stat_name

    AND t4.dbid            = t5.dbid

    AND t4.instance_number = t5.instance_number

    AND t5.snap_id         = (t4.snap_id -1)

    )

  ) v1,

  (SELECT snap.snap_id,

    snap.instance_number,

    snap.dbid,

    ROUND(ABS((A.Value-B.Value)/((Extract(Hour FROM ((Snap.End_Interval_Time - Snap.Begin_Interval_Time))) * 3600) + (Extract(Minute FROM ((Snap.End_Interval_Time - Snap.Begin_Interval_Time))) *60) + EXTRACT(Second FROM ((snap.end_interval_time - snap.begin_interval_time)))))) Flash_Reads_IO_Sec,

    ROUND(Read_Io.Average) Avg_Reads_Io_Sec,

    ROUND(Write_Io.Average) Avg_Writes_Io_Sec,

    ROUND(Read_Io.Maxval) Max_Reads_Io_Sec,

    ROUND(Write_Io.Maxval) Max_Writes_Io_Sec

  FROM Dba_Hist_Snapshot Snap,

    Dba_Hist_Sysstat A,

    Dba_Hist_Sysstat B,

    Dba_Hist_Sysmetric_Summary Read_Io,

    Dba_Hist_Sysmetric_Summary Write_Io

  WHERE a.dbid             = snap.dbid

  AND A.Snap_Id            = Snap.Snap_Id

  AND A.Instance_Number    = Snap.Instance_Number

  AND A.Stat_Name          = 'physical read requests optimized'

  AND a.dbid               = b.dbid

  AND B.Snap_Id            = (A.Snap_Id -1)

  AND A.Stat_Name          = B.Stat_Name

  AND A.Instance_Number    = B.Instance_Number

  AND Snap.dbid            = Read_Io.dbid

  AND Snap.Snap_Id         = Read_Io.Snap_Id

  AND snap.Instance_Number = Read_Io.Instance_Number

  AND Read_Io.Metric_Name  = 'Physical Read Total IO Requests Per Sec'

  AND Snap.dbid            = write_Io.dbid

  AND snap.Snap_Id         = Write_Io.Snap_Id

  AND snap.Instance_Number = Write_Io.Instance_Number

  AND Write_Io.Metric_Name = 'Physical Write Total IO Requests Per Sec'

  ) v2

WHERE TRUNC(a.begin_interval_time) >= TRUNC(sysdate) -  30

AND a.dbid             = b1.dbid

AND a.instance_number  = b1.instance_number

AND a.snap_id          = b1.snap_id

AND b1.stat_name       = 'DB time'

AND b1.stat_name       = b2.stat_name

AND b1.dbid            = b2.dbid

AND b1.instance_number = b2.instance_number

AND b2.snap_id         = (b1.snap_id -1)

AND a.dbid            = d.dbid

AND a.instance_number = d.instance_number

AND a.snap_id         = d.snap_id

AND d.metric_name     = 'Host CPU Utilization (%)'

AND a.dbid            = e.dbid

AND a.instance_number = e.instance_number

AND a.snap_id         = e.snap_id

AND e.metric_name     = 'Average Active Sessions'

AND a.dbid            = f.dbid

AND a.instance_number = f.instance_number

AND a.snap_id         = f.snap_id

AND f.metric_name     = 'Redo Generated Per Sec'

AND a.dbid            = g.dbid

AND a.instance_number = g.instance_number

AND a.snap_id         = g.snap_id

AND g.metric_name     = 'DB Block Changes Per Sec'

AND a.dbid            = h.dbid

AND a.instance_number = h.instance_number

AND a.snap_id         = h.snap_id

AND h.metric_name     = 'Logons Per Sec'

AND a.dbid            = i.dbid

AND a.instance_number = i.instance_number

AND a.snap_id         = i.snap_id

AND i.metric_name     = 'Average Synchronous Single-Block Read Latency'

AND a.dbid            = j.dbid

AND a.instance_number = j.instance_number

AND a.snap_id         = j.snap_id

AND j.metric_name     = 'Executions Per Sec'

AND a.dbid            = k.dbid

AND a.instance_number = k.instance_number

AND a.snap_id         = k.snap_id

AND k.metric_name     = 'Hard Parse Count Per Sec'

AND a.dbid            = l.dbid

AND a.instance_number = l.instance_number

AND a.snap_id         = l.snap_id

AND l.metric_name     = 'User Transaction Per Sec'

AND a.dbid            = l1.dbid

AND a.instance_number = l1.instance_number

AND a.snap_id         = l1.snap_id

AND l1.metric_name     = 'User Commits Per Sec'

AND a.dbid            = m.dbid

AND a.instance_number = m.instance_number

AND a.snap_id         = m.snap_id

AND m.metric_name     = 'User Rollbacks Per Sec'

AND a.dbid            = n.dbid

AND a.instance_number = n.instance_number

AND a.snap_id         = n.snap_id

AND n.stat_name       = 'logons current'

AND a.dbid            = v1.dbid

AND a.instance_number = v1.instance_number

AND a.snap_id         = v1.snap_id

AND a.dbid            = v2.dbid

AND a.instance_number = v2.instance_number

AND a.snap_id         = v2.snap_id

AND a.dbid            = o.dbid

AND a.instance_number = o.instance_number

AND a.snap_id         = o.snap_id

AND o.metric_name     = 'Logical Reads Per Sec'

AND a.dbid            = p.dbid

AND a.instance_number = p.instance_number

AND a.snap_id         = p.snap_id

AND p.metric_name       = 'Physical Read Bytes Per Sec'

AND a.dbid            = q.dbid

AND a.instance_number = q.instance_number

AND a.snap_id         = q.snap_id

AND q.metric_name       = 'Physical Write Bytes Per Sec'

ORDER BY a.snap_id, a.instance_number;