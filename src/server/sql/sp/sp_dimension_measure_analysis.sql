USE [RawDB]
GO

CREATE
  OR

ALTER PROCEDURE [dbo].[sp_dimension_measure_analysis] @OID VARCHAR(MAX)
AS
BEGIN
  -------------------------------------------------------------------------------
  -- Table column analysis                 					                    				|
  -------------------------------------------------------------------------------
  DECLARE @tableName VARCHAR(50),
    @sqlStr NVARCHAR(MAX),
    @cols VARCHAR(1000),
    @col VARCHAR(50),
    @value VARCHAR(MAX),
    @colValue VARCHAR(MAX) = ''

  SELECT @tableName = 'D' + @OID

  EXEC sp_AnalyzeTable @tableName,
    @cols OUTPUT

  SELECT @sqlStr = N'
  CREATE
    OR

  ALTER VIEW vd_D' + @OID +
    '_ColumnAnalysis
  AS
  SELECT *
  FROM (
    SELECT *,
      CONVERT(DECIMAL(12, 10), (CONVERT(REAL, Kn) / N)) AS Ratio
    FROM bd_AnalyzeTableColumn
    WHERE TableName = '''
    + @tableName + '''
    ) AS analysis
'

  EXEC (@sqlStr)

  -------------------------------------------------------------------------------
  -- Divide to dimension and measure       					                    				|
  -------------------------------------------------------------------------------
  SELECT @sqlStr = N'
  CREATE
    OR

  ALTER VIEW vd_D' + @OID +
    '_Dimension
  AS
  SELECT *
  FROM vd_D' + @OID +
    '_ColumnAnalysis
  WHERE DataType = ''varchar'' OR CONVERT(REAL, Ratio) < 0.01
'

  EXEC (@sqlStr)

  SELECT @sqlStr = N'
  CREATE
    OR

  ALTER VIEW vd_D' + @OID +
    '_Measure
  AS
  SELECT *
  FROM vd_D' + @OID +
    '_ColumnAnalysis
  WHERE DataType like ''%int'' AND CONVERT(REAL, Ratio) >= 0.01
	'

  EXEC (@sqlStr)

  SELECT @sqlStr =
    N'
		SELECT @cols = string_agg(ColumnName, '','') FROM (
			SELECT ColumnName FROM vd_D'
    + @OID + '_Dimension
		) as t
	'

  EXEC sp_executesql @sqlStr,
    N'@cols VARCHAR(1000) OUTPUT',
    @cols = @cols OUTPUT

  DECLARE aCursor CURSOR
  FOR
  SELECT value
  FROM string_split(@cols, ',')

  OPEN aCursor

  FETCH NEXT
  FROM aCursor
  INTO @col

  WHILE @@FETCH_STATUS = 0
  BEGIN
    SELECT @sqlStr =
      N'
			SELECT @value = string_agg(CAST(value AS NVARCHAR(MAX)), '','')
			FROM (
				SELECT DISTINCT ("'
      + @col + '") AS value
				FROM ' + @tableName + '
				) AS t
		'

    EXEC sp_executesql @sqlStr,
      N'@value VARCHAR(MAX) OUTPUT',
      @value = @value OUTPUT

    SELECT @colValue = @colValue + @col + ':' + @value + ':'

    FETCH NEXT
    FROM aCursor
    INTO @col
  END

  CLOSE aCursor

  DEALLOCATE aCursor

  SELECT @sqlStr = N'
  IF EXISTS (SELECT * FROM D' + @OID +
    '_ColDistinctValue)
	BEGIN
		DROP TABLE D' + @OID +
    '_ColDistinctValue
	END
	'

  EXEC (@sqlStr)

  SELECT @colValue = SUBSTRING(@colValue, 1, LEN(@colValue) - 1)

  SELECT @sqlStr = N'
  SELECT @colValue as value INTO D' + @OID +
    '_ColDistinctValue
	'

  EXEC sp_executesql @sqlStr,
    N'@colValue VARCHAR(MAX)',
    @colValue = @colValue

  RETURN
END
