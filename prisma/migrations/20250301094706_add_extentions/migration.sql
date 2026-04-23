-- This is an empty migration.
CREATE EXTENSION IF NOT EXISTS age;
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "lightrag_doc_chunks" (
    "id" VARCHAR(255) NOT NULL,
    "workspace" VARCHAR(255) NOT NULL,
    "full_doc_id" VARCHAR(256),
    "chunk_order_index" INTEGER,
    "tokens" INTEGER,
    "content" TEXT,
    "content_vector" vector,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6),
    "file_path" VARCHAR(256),

    CONSTRAINT "lightrag_doc_chunks_pk" PRIMARY KEY ("workspace","id")
);

-- CreateTable
CREATE TABLE "lightrag_doc_full" (
    "id" VARCHAR(255) NOT NULL,
    "workspace" VARCHAR(255) NOT NULL,
    "doc_name" VARCHAR(1024),
    "content" TEXT,
    "meta" JSONB,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6),

    CONSTRAINT "lightrag_doc_full_pk" PRIMARY KEY ("workspace","id")
);

-- CreateTable
CREATE TABLE "lightrag_doc_status" (
    "workspace" VARCHAR(255) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "content_summary" VARCHAR(255),
    "content_length" INTEGER,
    "chunks_count" INTEGER,
    "status" VARCHAR(64),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT,

    CONSTRAINT "lightrag_doc_status_pk" PRIMARY KEY ("workspace","id")
);

-- CreateTable
CREATE TABLE "lightrag_llm_cache" (
    "workspace" VARCHAR(255) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "mode" VARCHAR(32) NOT NULL,
    "original_prompt" TEXT,
    "return_value" TEXT,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6),

    CONSTRAINT "lightrag_llm_cache_pk" PRIMARY KEY ("workspace","mode","id")
);

-- CreateTable
CREATE TABLE "lightrag_vdb_entity" (
    "id" VARCHAR(255) NOT NULL,
    "workspace" VARCHAR(255) NOT NULL,
    "entity_name" VARCHAR(255),
    "content" TEXT,
    "content_vector" vector,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6),
    "chunk_ids" VARCHAR(255)[],
    "file_path" TEXT,

    CONSTRAINT "lightrag_vdb_entity_pk" PRIMARY KEY ("workspace","id")
);

-- CreateTable
CREATE TABLE "lightrag_vdb_relation" (
    "id" VARCHAR(255) NOT NULL,
    "workspace" VARCHAR(255) NOT NULL,
    "source_id" VARCHAR(256),
    "target_id" VARCHAR(256),
    "content" TEXT,
    "content_vector" vector,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6),
    "chunk_ids" VARCHAR(255)[],
    "file_path" TEXT,

    CONSTRAINT "lightrag_vdb_relation_pk" PRIMARY KEY ("workspace","id")
);

CREATE INDEX "idx_chunks_vector" ON "lightrag_doc_chunks"("content_vector");

CREATE INDEX "idx_doc_chunks_full_doc_id" ON "lightrag_doc_chunks"("workspace", "full_doc_id");

CREATE INDEX "idx_doc_status_status" ON "lightrag_doc_status"("workspace", "status");

CREATE INDEX "idx_llm_cache_mode" ON "lightrag_llm_cache"("workspace", "mode");

CREATE INDEX "idx_entity_entity_name" ON "lightrag_vdb_entity"("workspace", "entity_name");

CREATE INDEX "idx_entity_vector" ON "lightrag_vdb_entity"("content_vector");

CREATE INDEX "idx_relation_source_id" ON "lightrag_vdb_relation"("workspace", "source_id");

CREATE INDEX "idx_relation_target_id" ON "lightrag_vdb_relation"("workspace", "target_id");

CREATE INDEX "idx_relation_vector" ON "lightrag_vdb_relation"("content_vector");

CREATE INDEX "idx_lightrag_doc_chunks_id" ON "lightrag_doc_chunks"("id");
CREATE INDEX "idx_lightrag_doc_full_id" ON "lightrag_doc_full"("id");
CREATE INDEX "idx_lightrag_doc_status_id" ON "lightrag_doc_status"("id");
CREATE INDEX "idx_lightrag_llm_cache_id" ON "lightrag_llm_cache"("id");
CREATE INDEX "idx_lightrag_vdb_entity_id" ON "lightrag_vdb_entity"("id");
CREATE INDEX "idx_lightrag_vdb_relation_id" ON "lightrag_vdb_relation"("id");