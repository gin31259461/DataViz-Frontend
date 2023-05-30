USE [DV]
GO

-------------------------------------------------------------------------------
-- SP Post Data          													               							|
-------------------------------------------------------------------------------
CREATE
  OR

ALTER PROCEDURE [dbo].[usp_PostData] @mid INT,
  @name NVARCHAR(30),
  @des NVARCHAR(MAX),
  @lastID NVARCHAR(MAX) OUTPUT
AS
BEGIN
  DECLARE @insertedRows TABLE (id INT);

  INSERT INTO OBJECT (
    TYPE,
    CName,
    CDes,
    nClick,
    OwnerMID
    )
  OUTPUT inserted.OID
  INTO @insertedRows
  VALUES (
    6,
    @Name,
    @Des,
    1,
    @MID
    )

  SELECT @lastID = id
  FROM @insertedRows;

  INSERT INTO dbo.Data (DID)
  VALUES (@lastID)
END
