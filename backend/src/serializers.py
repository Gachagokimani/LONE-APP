from rest_framework import serializers
from .models import User, CustomerProfile, LoanApplication, LoanEvent


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone']
        read_only_fields = ['id']


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class LoanApplicationSerializer(serializers.ModelSerializer):
    customer_details = CustomerProfileSerializer(source='customer', read_only=True)
    current_balance = serializers.SerializerMethodField()

    class Meta:
        model = LoanApplication
        fields = '__all__'
        read_only_fields = ['id', 'applied_at', 'updated_at']

    def get_current_balance(self, obj):
        return obj.current_balance()


class LoanEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanEvent
        fields = '__all__'
        read_only_fields = ['id', 'created_at']