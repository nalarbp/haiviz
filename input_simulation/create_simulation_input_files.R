library(tidyverse)
library(igraph)
library(ape)
library(phytools)
library(xml2)

set.seed(123456789)

generateTestDatasets <- function(n_samples){
#some basic params
n_max <- 1000
n_patients <- n_samples/2
n_locations <- 225
n_sources <- 10
n_species <- 5
n_strains <- 50
n_clusters <- 50

#++make output directory
out_dir <- paste0('input_simulation/', n_samples, '_samples')
if(!dir.exists(out_dir)){
  dir.create(out_dir)
} else {
  unlink(out_dir, recursive = TRUE)
  dir.create(out_dir)
}

#++make metadata
metadata_df <- data.frame(
  'id' = paste0('sample_', 1:n_samples),
  'date' = sample(seq(as.Date('2018/01/01'), as.Date('2022/10/21'), by="day"), n_samples, replace = TRUE),
  'location' = paste0('location_', sample(1:n_locations, n_samples, replace = TRUE)),
  'pid' = paste0('patient_', sample(1:n_patients, n_samples, replace = TRUE)),
  'source' = paste0('source_', sample(1:n_sources, n_samples, replace = TRUE)),
  'species' = paste0('species_', sample(1:n_species, n_samples, replace = TRUE)),
  'strain' = paste0('strain_', sample(1:n_strains, n_samples, replace = TRUE)),
  'cluster' = paste('cluster_', sample(1:10, n_clusters, replace = TRUE)),
  'geneA' = sample(c('Present', 'Absent'), n_samples, replace = TRUE),
  'geneB' = sample(c('1', '0'), n_samples, replace = TRUE),
  stringsAsFactors = FALSE
)
write_csv(metadata_df, paste0(out_dir, '/metadata.csv'))

#++make HAIviz simulated map
##simulate grid points
all_locations <- data.frame(
  'location' = paste0('location_', 1:n_locations),
  'x' = rep(seq(50, 950, length.out = 15), 15),
  'y' = rep(seq(50, 950, length.out = 15), each = 15)
)
metadata_locations <- all_locations %>% filter(location %in% metadata_df$location)
haiviz_mapdata <- metadata_locations %>%
    mutate(haiviz_mapdata=as.character(paste0('location name="', location, '" x="', round(x), '" y="', round(y), '"'))) %>%
    pull(haiviz_mapdata)

#update xml map file
xml_file <- read_xml('input_simulation/haivizMap_base.xml')
mapdata <- xml_find_first(xml_file, '//mapdata')
for(loc in haiviz_mapdata){
  xml_add_child(mapdata, loc)
}
write_xml(xml_file, paste0(out_dir, '/map.xml'))

#++make phylo tree
tree <- midpoint.root(rtree(n_samples))
tree$tip.label <- metadata_df$id
write.tree(tree, paste0(out_dir, '/tree.nwk'))

#++make cluster graph
graph <- erdos.renyi.game(n_samples, 0.01, directed = FALSE, loops = FALSE)
V(graph)$name <- metadata_df$id
write.graph(graph, paste0(out_dir, '/graph.dot'), format = 'dot')

#++make patient movement csv
patient_movement <- metadata_df %>% select(pid, location, 'start_date' = date) %>% 
    distinct() %>%
    mutate('end_date' = start_date + sample(1:10, nrow(.), replace = TRUE))
more_patient_movement <- patient_movement
for(i in 1:nrow(patient_movement)){
  more_patient_movement <- more_patient_movement %>%
      add_row(pid = more_patient_movement$pid[i], location = more_patient_movement$location[i], start_date = more_patient_movement$end_date[i], end_date = more_patient_movement$end_date[i] + sample(1:3, 1))
} 
write_csv(more_patient_movement, paste0(out_dir, '/movement.csv'))

}

dataset_sizes <- c(50, 250, 500, 750, 1000)
for(n in dataset_sizes){
  generateTestDatasets(n)
}
