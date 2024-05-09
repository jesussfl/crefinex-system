/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categoria_Militar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categorias_Grados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Clasificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Componente_Militar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Despacho` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Despachos_Renglones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Destinatario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Devolucion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grado_Militar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grados_Componentes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recepcion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recepciones_Renglones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Renglon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Serial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sistemas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subsistemas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnidadEmpaque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unidad_Militar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `almacenes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personal_militar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `redis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reposos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zodis` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cedula]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Generos" AS ENUM ('Femenino', 'Masculino');

-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_id_clasificacion_fkey";

-- DropForeignKey
ALTER TABLE "Categorias_Grados" DROP CONSTRAINT "Categorias_Grados_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "Categorias_Grados" DROP CONSTRAINT "Categorias_Grados_id_grado_fkey";

-- DropForeignKey
ALTER TABLE "Despacho" DROP CONSTRAINT "Despacho_cedula_destinatario_fkey";

-- DropForeignKey
ALTER TABLE "Despachos_Renglones" DROP CONSTRAINT "Despachos_Renglones_id_despacho_fkey";

-- DropForeignKey
ALTER TABLE "Despachos_Renglones" DROP CONSTRAINT "Despachos_Renglones_id_renglon_fkey";

-- DropForeignKey
ALTER TABLE "Destinatario" DROP CONSTRAINT "Destinatario_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "Destinatario" DROP CONSTRAINT "Destinatario_id_componente_fkey";

-- DropForeignKey
ALTER TABLE "Destinatario" DROP CONSTRAINT "Destinatario_id_grado_fkey";

-- DropForeignKey
ALTER TABLE "Destinatario" DROP CONSTRAINT "Destinatario_id_unidad_fkey";

-- DropForeignKey
ALTER TABLE "Devolucion" DROP CONSTRAINT "Devolucion_id_serial_fkey";

-- DropForeignKey
ALTER TABLE "Grados_Componentes" DROP CONSTRAINT "Grados_Componentes_id_componente_fkey";

-- DropForeignKey
ALTER TABLE "Grados_Componentes" DROP CONSTRAINT "Grados_Componentes_id_grado_fkey";

-- DropForeignKey
ALTER TABLE "Recepciones_Renglones" DROP CONSTRAINT "Recepciones_Renglones_id_recepcion_fkey";

-- DropForeignKey
ALTER TABLE "Recepciones_Renglones" DROP CONSTRAINT "Recepciones_Renglones_id_renglon_fkey";

-- DropForeignKey
ALTER TABLE "Renglon" DROP CONSTRAINT "Renglon_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Renglon" DROP CONSTRAINT "Renglon_clasificacionId_fkey";

-- DropForeignKey
ALTER TABLE "Renglon" DROP CONSTRAINT "Renglon_unidadEmpaqueId_fkey";

-- DropForeignKey
ALTER TABLE "Serial" DROP CONSTRAINT "Serial_id_despacho_fkey";

-- DropForeignKey
ALTER TABLE "Serial" DROP CONSTRAINT "Serial_id_recepcion_fkey";

-- DropForeignKey
ALTER TABLE "Sistemas" DROP CONSTRAINT "Sistemas_id_almacen_fkey";

-- DropForeignKey
ALTER TABLE "Subsistemas" DROP CONSTRAINT "Subsistemas_id_almacen_fkey";

-- DropForeignKey
ALTER TABLE "UnidadEmpaque" DROP CONSTRAINT "UnidadEmpaque_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "Unidad_Militar" DROP CONSTRAINT "Unidad_Militar_id_zodi_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_categoria_MilitarId_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_componente_MilitarId_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_grado_MilitarId_fkey";

-- DropForeignKey
ALTER TABLE "personal_militar" DROP CONSTRAINT "personal_militar_unidad_MilitarId_fkey";

-- DropForeignKey
ALTER TABLE "zodis" DROP CONSTRAINT "zodis_id_redi_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "cedula" TEXT,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "tipo_cedula" "Tipos_Cedulas";

-- DropTable
DROP TABLE "Categoria";

-- DropTable
DROP TABLE "Categoria_Militar";

-- DropTable
DROP TABLE "Categorias_Grados";

-- DropTable
DROP TABLE "Clasificacion";

-- DropTable
DROP TABLE "Componente_Militar";

-- DropTable
DROP TABLE "Despacho";

-- DropTable
DROP TABLE "Despachos_Renglones";

-- DropTable
DROP TABLE "Destinatario";

-- DropTable
DROP TABLE "Devolucion";

-- DropTable
DROP TABLE "Grado_Militar";

-- DropTable
DROP TABLE "Grados_Componentes";

-- DropTable
DROP TABLE "Recepcion";

-- DropTable
DROP TABLE "Recepciones_Renglones";

-- DropTable
DROP TABLE "Renglon";

-- DropTable
DROP TABLE "Serial";

-- DropTable
DROP TABLE "Sistemas";

-- DropTable
DROP TABLE "Subsistemas";

-- DropTable
DROP TABLE "UnidadEmpaque";

-- DropTable
DROP TABLE "Unidad_Militar";

-- DropTable
DROP TABLE "almacenes";

-- DropTable
DROP TABLE "personal_militar";

-- DropTable
DROP TABLE "redis";

-- DropTable
DROP TABLE "reposos";

-- DropTable
DROP TABLE "zodis";

-- DropEnum
DROP TYPE "Medidas";

-- DropEnum
DROP TYPE "RenglonStates";

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "fecha_realizado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "names" TEXT NOT NULL,
    "lastNames" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cedula_key" ON "User"("cedula");

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
