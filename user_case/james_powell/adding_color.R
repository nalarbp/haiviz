"
Name    : HAIviz input file modification
Desc    : This script Add color on haiviz input files
Author  : Budi Permana | Beatsonlab UQ | 2021
"
library(dplyr)
library(RColorBrewer)


#STEP 0: load input files
metadata <- read.csv('/Volumes/BUDI/PhD/0_THESIS/chapter_haiviz/APP/haiviz-new/user_case/james_powell/Specimen Metadata2.csv')
movement <- read.csv('/Volumes/BUDI/PhD/0_THESIS/chapter_haiviz/APP/haiviz-new/user_case/james_powell/New ED Pt Movements.csv')


#STEP 1: add new color column
##create color palette generator
col_domain <- as.vector(levels(as.factor(movement$location_name)))
paired_pal <- colorRampPalette(brewer.pal(12,"Paired"))
col_range <- paired_pal(length(col_domain))
names(col_range) <- col_domain

movement_wColor <- movement %>%
  rowwise() %>%
  mutate('location_color' = col_range[paste(location_name)])

write.csv(movement_wColor, 'New_ED_Pt_Movements_wColor.csv', quote = F, row.names = F)
