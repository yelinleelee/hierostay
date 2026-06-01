package handler

import (
	"crypto/subtle"
	"encoding/csv"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/hierolabs/openletter/backend/internal/model"
)

const (
	hieroDefaultCheckIn  = "15:00"
	hieroDefaultCheckOut = "11:00"
	hieroListJoinSep     = "|"
)

var hieroCSVHeader = []string{
	"code", "name", "region", "address", "type",
	"guests", "bedrooms", "beds", "bathrooms",
	"checkIn", "checkOut", "license", "title", "description",
	"transport", "nearby", "amenities", "rules",
	"nightly", "weekend", "weekly", "biweekly", "monthly",
	"managementWeekly", "managementMonthly",
	"cleaning", "deposit", "photos",
}

func ExportListingsCSV(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		expected := os.Getenv("HIERO_EXPORT_API_KEY")
		if expected == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "export key not configured"})
			return
		}
		got := c.GetHeader("X-API-Key")
		if got == "" || subtle.ConstantTimeCompare([]byte(got), []byte(expected)) != 1 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		var properties []model.Property
		if err := db.Where("is_available = ?", true).Order("id ASC").Find(&properties).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.Header("Content-Type", "text/csv; charset=utf-8")
		c.Header("Content-Disposition", `attachment; filename="openletter-listings.csv"`)

		w := csv.NewWriter(c.Writer)
		defer w.Flush()

		if err := w.Write(hieroCSVHeader); err != nil {
			return
		}

		for _, p := range properties {
			region := p.City
			if p.Country != "" {
				region = p.City + ", " + p.Country
			}
			row := []string{
				strconv.FormatUint(uint64(p.ID), 10),
				p.Title,
				region,
				p.Address,
				p.PropertyType,
				strconv.Itoa(p.MaxGuests),
				strconv.Itoa(p.Bedrooms),
				strconv.Itoa(p.Beds),
				strconv.FormatFloat(float64(p.Bathrooms), 'f', -1, 32),
				hieroDefaultCheckIn,
				hieroDefaultCheckOut,
				"",
				p.Title,
				p.Description,
				"",
				"",
				strings.Join(p.Amenities, hieroListJoinSep),
				"",
				strconv.FormatFloat(p.Price, 'f', -1, 64),
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				"",
				strings.Join(p.Images, hieroListJoinSep),
			}
			if err := w.Write(row); err != nil {
				return
			}
		}
	}
}
